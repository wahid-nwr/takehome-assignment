import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = uuidv4();

  req.correlationId = requestId;

  res.setHeader("X-Request-ID", requestId);

  next();
}