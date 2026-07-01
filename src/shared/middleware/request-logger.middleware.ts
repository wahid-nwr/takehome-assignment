import { NextFunction, Request, Response } from "express";
import logger from "./../../logging/logger";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = process.hrtime.bigint();

  logger.info(
    {
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    },
    "Request started"
  );

  res.on("finish", () => {
    const durationMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info(
      {
        correlationId: req.correlationId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        tenantId: req.tenant?.id,
        ip: req.ip,
      },
      "Request completed"
    );
  });

  next();
}