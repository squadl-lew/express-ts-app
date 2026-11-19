import { prismaClient } from "../src/application/database";
import { Product } from "@prisma/client";

export class ProductTest {

    static async deleteAll() {
        await prismaClient.product.deleteMany({});
    }

    static async create() {
        await prismaClient.product.create({
            data: {
                name: "test",
                category: "test",
                description: "test",
                buyPrice: 8000,
                sellPrice: 10000,
                stock: 20
            }
        });
    }

    static async get(): Promise<Product> {
        const product = await prismaClient.product.findFirst({
            where: {
                name: "test"
            }
        });

        if (!product) {
            throw new Error("Product is not found");
        }

        return product;
    }

}
