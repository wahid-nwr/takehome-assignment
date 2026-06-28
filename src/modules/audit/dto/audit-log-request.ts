import { AuditData } from "./../audit-data";
import { AuditAction } from './../audit-action';

export interface AuditLogRequest {
    tenantId: string;
    flagId: string;
    action: AuditAction;
    previousValue?: AuditData;
    newValue?: AuditData;
    changedBy?: string;
}