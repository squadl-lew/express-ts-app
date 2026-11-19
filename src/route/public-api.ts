import express, { Request, Response } from "express";

export const publicRouter = express.Router();

publicRouter.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Hello from Express + TypeScript!" });
});

publicRouter.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});
