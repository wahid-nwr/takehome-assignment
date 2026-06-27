import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors
                });
            }

            next(error);
        }
    };