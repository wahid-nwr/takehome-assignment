import { Request, Response, NextFunction } from "express";

import {
    evaluationErrorsTotal,
    evaluationRequestsTotal,
} from "./metrics";

export function metricsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    if (
        req.path === "/api/v1/evaluate" ||
        req.path === "/api/v1/evaluate/bulk"
    ) {
        evaluationRequestsTotal.inc();
    }

    res.on("finish", () => {
        if (res.statusCode >= 500) {
            evaluationErrorsTotal.inc();
        }
    });

    next();
}