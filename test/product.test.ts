import supertest from "supertest";
import { web } from "../src/application/web";

// Prisma dimock di test ini karena tidak ada server MySQL di
// lingkungan test ini. Service tetap diuji lewat HTTP (supertest),
// dengan data disimpan di memori oleh mock di bawah.
// Untuk test integrasi ke MySQL asli, jalankan migration lalu
// hapus jest.mock ini dan gunakan test/test-util.ts.

jest.mock("../src/application/database", () => {
    const store: any[] = [];
    let nextId = 1;

    const matches = (product: any, where: any): boolean => {
        if (!where || !where.AND) return true;
        return where.AND.every((filter: any) => {
            if (filter.name?.contains) return product.name.includes(filter.name.contains);
            if (filter.category?.contains) return product.category.includes(filter.category.contains);
            return true;
        });
    };

    return {
        prismaClient: {
            product: {
                create: jest.fn(async ({ data }: any) => {
                    const product = {
                        id: nextId++,
                        description: null,
                        stock: 0,
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    store.push(product);
                    return product;
                }),
                findFirst: jest.fn(async ({ where }: any) => {
                    return store.find((p) => p.id === where.id) || null;
                }),
                findMany: jest.fn(async ({ where, take, skip }: any) => {
                    const filtered = store.filter((p) => matches(p, where));
                    return filtered.slice(skip, skip + take);
                }),
                count: jest.fn(async ({ where }: any) => {
                    return store.filter((p) => matches(p, where)).length;
                }),
                update: jest.fn(async ({ where, data }: any) => {
                    const product = store.find((p) => p.id === where.id);
                    Object.assign(product, data);
                    return product;
                }),
                delete: jest.fn(async ({ where }: any) => {
                    const index = store.findIndex((p) => p.id === where.id);
                    const [product] = store.splice(index, 1);
                    return product;
                }),
                deleteMany: jest.fn(async () => {
                    store.length = 0;
                    nextId = 1;
                    return { count: 0 };
                }),
            },
        },
    };
});

import { prismaClient } from "../src/application/database";

describe("POST /api/products", () => {
    beforeEach(async () => {
        await prismaClient.product.deleteMany({});
    });

    it("should create a new product", async () => {
        const response = await supertest(web).post("/api/products").send({
            name: "test",
            category: "test",
            description: "test",
            buyPrice: 8000,
            sellPrice: 10000,
            stock: 20
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.category).toBe("test");
        expect(response.body.data.buyPrice).toBe(8000);
        expect(response.body.data.sellPrice).toBe(10000);
        expect(response.body.data.stock).toBe(20);
    });

    it("should reject invalid product", async () => {
        const response = await supertest(web).post("/api/products").send({
            name: "",
            category: "",
            buyPrice: -1,
            sellPrice: 10000
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should be able to get, update, search, and remove a product", async () => {
        const created = await supertest(web).post("/api/products").send({
            name: "Kopi",
            category: "Minuman",
            buyPrice: 8000,
            sellPrice: 10000,
            stock: 10
        });
        const id = created.body.data.id;

        const getResponse = await supertest(web).get(`/api/products/${id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data.name).toBe("Kopi");

        const updateResponse = await supertest(web).put(`/api/products/${id}`).send({
            name: "Kopi Gula Aren",
            category: "Minuman",
            buyPrice: 8000,
            sellPrice: 12000,
            stock: 15
        });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.data.sellPrice).toBe(12000);

        const searchResponse = await supertest(web).get("/api/products?name=Kopi");
        expect(searchResponse.status).toBe(200);
        expect(searchResponse.body.data.length).toBe(1);
        expect(searchResponse.body.paging.total_page).toBe(1);

        const deleteResponse = await supertest(web).delete(`/api/products/${id}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.data).toBe("OK");

        const notFoundResponse = await supertest(web).get(`/api/products/${id}`);
        expect(notFoundResponse.status).toBe(404);
    });
});
