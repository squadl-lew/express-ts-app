import express from "express";
import { ProductController } from "../controller/product-controller";

export const apiRouter = express.Router();

// Product API
apiRouter.post("/api/products", ProductController.create);
apiRouter.get("/api/products/:productId(\\d+)", ProductController.get);
apiRouter.put("/api/products/:productId(\\d+)", ProductController.update);
apiRouter.delete("/api/products/:productId(\\d+)", ProductController.remove);
apiRouter.get("/api/products", ProductController.search);
