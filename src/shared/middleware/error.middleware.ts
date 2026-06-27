import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (err instanceof AppError) {

        return res.status(err.statusCode).json({
            success: false,
            error: err.name,
            message: err.message
        });

    }

    console.error(err);

    return res.status(500).json({
        success: false,
        error: "InternalServerError",
        message: "Something went wrong"
    });

}