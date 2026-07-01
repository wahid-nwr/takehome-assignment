import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { evaluationErrorsTotal } from "../../metrics/metrics";
import logger from "../../logging/logger";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) {

    if (err instanceof AppError) {
        evaluationErrorsTotal.inc();

        logger.error(
            {
                err,
                correlationId: req.correlationId,
                method: req.method,
                path: req.originalUrl,
                tenantId: req.tenant?.id,
            },
            "Request failed"
        );

        return res.status(err.statusCode).json({
            success: false,
            error: err.name,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        error: "InternalServerError",
        message: "Something went wrong"
    });
}