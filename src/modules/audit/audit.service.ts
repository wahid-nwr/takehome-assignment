import { AuditRepository } from './audit.repository';
import { FlagRepository } from './../flags/flag.repository';
import { AuditAction } from './audit-action';
import { AuditData } from "./audit-data";
import { NotFoundError } from "../../shared/errors/notfound.error";


export class AuditService {

constructor(
        private readonly auditRepository: AuditRepository,
        private readonly flagRepository: FlagRepository
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
        flagKey: string,
        environment: string
    ) {
        const flag = await this.flagRepository.findByKey(
            tenantId,
            flagKey,
            environment
        );

        if (!flag) {
            throw new NotFoundError("Feature flag not found.");
        }

        return this.auditRepository.getHistory(
            tenantId,
            flag.id
        );
    }
}