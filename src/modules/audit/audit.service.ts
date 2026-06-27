import { AuditRepository } from './audit.repository';
import { AuditAction } from './audit-action';
import { AuditData } from "./audit-data";

export class AuditService {

constructor(
        private auditRepository: AuditRepository
    ) {}

    async log(params: {
        tenantId: string;
        flagId: string;
        action: AuditAction;
        previousValue?: AuditData;
        newValue?: AuditData;
        changedBy?: string;
    }) {

        await this.auditRepository.insert({
            tenantId: params.tenantId,
            flagId: params.flagId,
            action: params.action,
            previousValue: params.previousValue,
            newValue: params.newValue,
            changedBy: params.changedBy
        });
    }

    async getHistory(
        tenantId: string,
        flagId: string
    ) {
        return this.auditRepository.getHistory(
            tenantId,
            flagId
        );
    }
}