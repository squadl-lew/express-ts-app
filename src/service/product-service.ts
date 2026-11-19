import {
    CreateProductRequest,
    ProductResponse,
    SearchProductRequest,
    toProductResponse,
    UpdateProductRequest
} from "../model/product-model";
import { Validation } from "../validation/validation";
import { ProductValidation } from "../validation/product-validation";
import { Product } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class ProductService {

    static async create(request: CreateProductRequest): Promise<ProductResponse> {
        const createRequest = Validation.validate(ProductValidation.CREATE, request);

        const product = await prismaClient.product.create({
            data: createRequest
        });

        logger.debug("record : " + JSON.stringify(product));
        return toProductResponse(product);
    }

    static async checkProductMustExists(id: number): Promise<Product> {
        const product = await prismaClient.product.findFirst({
            where: {
                id: id
            }
        });

        if (!product) {
            throw new ResponseError(404, "Product not found");
        }

        return product;
    }

    static async get(id: number): Promise<ProductResponse> {
        const product = await this.checkProductMustExists(id);
        return toProductResponse(product);
    }

    static async update(request: UpdateProductRequest): Promise<ProductResponse> {
        const updateRequest = Validation.validate(ProductValidation.UPDATE, request);
        await this.checkProductMustExists(updateRequest.id);

        const product = await prismaClient.product.update({
            where: {
                id: updateRequest.id
            },
            data: updateRequest
        });

        return toProductResponse(product);
    }

    static async remove(id: number): Promise<ProductResponse> {
        await this.checkProductMustExists(id);

        const product = await prismaClient.product.delete({
            where: {
                id: id
            }
        });

        return toProductResponse(product);
    }

    static async search(request: SearchProductRequest): Promise<Pageable<ProductResponse>> {
        const searchRequest = Validation.validate(ProductValidation.SEARCH, request);
        const skip = (searchRequest.page - 1) * searchRequest.size;

        const filters = [];
        if (searchRequest.name) {
            filters.push({
                name: {
                    contains: searchRequest.name
                }
            });
        }
        if (searchRequest.category) {
            filters.push({
                category: {
                    contains: searchRequest.category
                }
            });
        }

        const products = await prismaClient.product.findMany({
            where: {
                AND: filters
            },
            take: searchRequest.size,
            skip: skip
        });

        const total = await prismaClient.product.count({
            where: {
                AND: filters
            },
        });

        return {
            data: products.map(product => toProductResponse(product)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size
            }
        };
    }

}
