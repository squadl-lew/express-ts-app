import { z, ZodType } from "zod";

export class ProductValidation {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        category: z.string().min(1).max(100),
        description: z.string().min(1).max(255).optional(),
        buyPrice: z.number().int().min(0),
        sellPrice: z.number().int().min(0),
        stock: z.number().int().min(0).optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        name: z.string().min(1).max(100),
        category: z.string().min(1).max(100),
        description: z.string().min(1).max(255).optional(),
        buyPrice: z.number().int().min(0),
        sellPrice: z.number().int().min(0),
        stock: z.number().int().min(0),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive()
    })

}
