import { Environment } from "@prisma/client";

export interface BulkEvaluationRequest {
    tenantId: string;
    environment: Environment;
    userIds: string[];
    context?: Record<string, unknown>;
}