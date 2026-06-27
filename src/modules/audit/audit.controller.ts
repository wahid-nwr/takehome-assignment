import { Request, Response } from "express";
import { AuditService } from "./audit.service";

export class AuditController {

constructor(
        private readonly auditService: AuditService
    ) {}

    async getHistory(
        req: Request,
        res: Response
    ): Promise<void> {

        const tenantId = req.tenant!.id;
        const flagKey = req.params.flagKey;

        const history = await this.auditService.getHistory(
            tenantId,
            flagKey
        );

        res.json(history);
    }
}