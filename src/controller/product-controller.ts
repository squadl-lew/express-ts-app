import { Request, Response, NextFunction } from "express";
import { CreateProductRequest, SearchProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";
import { logger } from "../application/logging";

export class ProductController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateProductRequest = req.body as CreateProductRequest;
            const response = await ProductService.create(request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = Number(req.params.productId);
            const response = await ProductService.get(productId);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateProductRequest = req.body as UpdateProductRequest;
            request.id = Number(req.params.productId);

            const response = await ProductService.update(request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = Number(req.params.productId);
            const response = await ProductService.remove(productId);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const request: SearchProductRequest = {
                ...(req.query.name ? { name: req.query.name as string } : {}),
                ...(req.query.category ? { category: req.query.category as string } : {}),
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 10,
            };
            const response = await ProductService.search(request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

}
