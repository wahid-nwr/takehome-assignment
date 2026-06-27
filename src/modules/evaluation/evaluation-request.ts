import { Environment } from "@prisma/client";

export interface EvaluationRequest {
    tenantId: string;
    environment: Environment;
    userId: string;
    context?: Record<string, unknown>;
}