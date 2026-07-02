import { Request, Response, NextFunction } from "express";
import { AuditService } from "./audit.service";
import { Environment } from "@prisma/client";

export class AuditController {

constructor(
        private readonly auditService: AuditService
    ) {}

    getHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {
            const tenantId = req.params.tenantId;
            const flagKey = req.params.flagKey;

            const history = await this.auditService.getHistory(
                tenantId,
                flagKey,
                req.query.environment as Environment
            );

            res.json(history);
        } catch (error) {
            next(error);
        }
    };
}