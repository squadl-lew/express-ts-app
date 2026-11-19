import { ProductTest } from "./test-util";
import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

// Prisma dimock di test ini karena tidak ada server MySQL di
// lingkungan test ini. Strukturnya mengikuti contoh PZN:
// supertest(web), ProductTest dari test-util, describe per endpoint,
// beforeEach create, afterEach deleteAll.
// Untuk test integrasi ke MySQL asli, jalankan migration lalu
// hapus jest.mock ini; ProductTest dan test ini tetap sama.

jest.mock("../src/application/database", () => {
    const store: any[] = [];
    let nextId = 1;

    const matchesWhere = (product: any, where: any): boolean => {
        if (!where) return true;
        if (where.id !== undefined && product.id !== where.id) return false;
        if (where.name !== undefined && product.name !== where.name) return false;
        if (where.category !== undefined && product.category !== where.category) return false;
        if (where.AND) {
            return where.AND.every((filter: any) => {
                if (filter.name?.contains) return product.name.includes(filter.name.contains);
                if (filter.category?.contains) return product.category.includes(filter.category.contains);
                return true;
            });
        }
        return true;
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
                    return store.find((p) => matchesWhere(p, where)) || null;
                }),
                findMany: jest.fn(async ({ where, take, skip }: any) => {
                    const filtered = store.filter((p) => matchesWhere(p, where));
                    return filtered.slice(skip, skip + take);
                }),
                count: jest.fn(async ({ where }: any) => {
                    return store.filter((p) => matchesWhere(p, where)).length;
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

describe('POST /api/products', () => {
    afterEach(async () => {
        await ProductTest.deleteAll();
    });

    it('should create new product', async () => {
        const response = await supertest(web)
            .post("/api/products")
            .send({
                name: "test",
                category: "test",
                description: "test",
                buyPrice: 8000,
                sellPrice: 10000,
                stock: 20
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.category).toBe("test");
        expect(response.body.data.description).toBe("test");
        expect(response.body.data.buyPrice).toBe(8000);
        expect(response.body.data.sellPrice).toBe(10000);
        expect(response.body.data.stock).toBe(20);
    });

    it('should reject create new product if data is invalid', async () => {
        const response = await supertest(web)
            .post("/api/products")
            .send({
                name: "",
                category: "",
                buyPrice: -1,
                sellPrice: 10000
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/products/:productId', () => {
    beforeEach(async () => {
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.deleteAll();
    });

    it('should be able get product', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .get(`/api/products/${product.id}`);

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe(product.name);
        expect(response.body.data.category).toBe(product.category);
        expect(response.body.data.description).toBe(product.description);
        expect(response.body.data.buyPrice).toBe(product.buyPrice);
        expect(response.body.data.sellPrice).toBe(product.sellPrice);
        expect(response.body.data.stock).toBe(product.stock);
    });

    it('should reject get product if product is not found', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .get(`/api/products/${product.id + 1}`);

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/products/:productId', () => {
    beforeEach(async () => {
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.deleteAll();
    });

    it('should be able to update product', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .put(`/api/products/${product.id}`)
            .send({
                name: "test",
                category: "test",
                description: "test",
                buyPrice: 9000,
                sellPrice: 12000,
                stock: 15
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(product.id);
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.buyPrice).toBe(9000);
        expect(response.body.data.sellPrice).toBe(12000);
        expect(response.body.data.stock).toBe(15);
    });

    it('should reject update product if request is invalid', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .put(`/api/products/${product.id}`)
            .send({
                name: "",
                category: "",
                buyPrice: -1,
                sellPrice: 10000,
                stock: 20
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/products/:productId', () => {
    beforeEach(async () => {
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.deleteAll();
    });

    it('should be able to remove product', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .delete(`/api/products/${product.id}`);

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it('should reject remove product if product is not found', async () => {
        const product = await ProductTest.get();
        const response = await supertest(web)
            .delete(`/api/products/${product.id + 1}`);

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/products', () => {
    beforeEach(async () => {
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.deleteAll();
    });

    it('should be able to search product', async () => {
        const response = await supertest(web)
            .get("/api/products");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it('should be able to search product using name', async () => {
        const response = await supertest(web)
            .get("/api/products")
            .query({
                name: "es"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it('should be able to search product using category', async () => {
        const response = await supertest(web)
            .get("/api/products")
            .query({
                category: "test"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it('should be able to search product no result', async () => {
        const response = await supertest(web)
            .get("/api/products")
            .query({
                name: "salah"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(10);
    });

    it('should be able to search product with paging', async () => {
        const response = await supertest(web)
            .get("/api/products")
            .query({
                page: 2,
                size: 1
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });

    it('should be able to search product with empty name and category (FE mengirim name=&category=)', async () => {
        const response = await supertest(web)
            .get("/api/products")
            .query({
                name: "",
                category: "",
                page: 1,
                size: 5
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(5);
    });
});
