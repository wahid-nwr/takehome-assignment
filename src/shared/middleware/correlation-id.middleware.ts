import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export function correlationIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    req.correlationId = randomUUID();

    res.setHeader(
        "x-correlation-id",
        req.correlationId
    );

    next();
}