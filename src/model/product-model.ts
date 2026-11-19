import { Product } from "@prisma/client";

export type ProductResponse = {
    id: number;
    name: string;
    category: string;
    description?: string | null;
    buyPrice: number;
    sellPrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateProductRequest = {
    name: string;
    category: string;
    description?: string;
    buyPrice: number;
    sellPrice: number;
    stock?: number;
}

export type UpdateProductRequest = {
    id: number;
    name: string;
    category: string;
    description?: string;
    buyPrice: number;
    sellPrice: number;
    stock: number;
}

export type SearchProductRequest = {
    name?: string;
    category?: string;
    page: number;
    size: number;
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    }
}
