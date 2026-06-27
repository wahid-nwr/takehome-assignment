import crypto from "crypto";

import { CacheService } from "../../shared/cache/cache.service";
import { FlagRepository } from "./../flags/flag.repository";
import { RolloutEngine } from "./rollout.engine";
import { Environment, FlagType } from "@prisma/client";
import { EvaluationRequest } from "./evaluation-request";
import { EvaluatableFlag } from "./models/evaluatable-flag";
import { BulkEvaluationRequest } from "./dto/bulk-evaluation-request";

export class EvaluationService {
    constructor(
        private readonly cacheService: CacheService,
        private readonly flagRepository: FlagRepository,
        private readonly rolloutEngine: RolloutEngine
    ) {}

    async evaluate(request: EvaluationRequest) : Promise<Record<string, unknown>> {
        const {
            tenantId,
            environment,
            userId
        } = request;
        const cacheKey = `flags:${tenantId}:${environment}`;

        let flags = await this.cacheService.get<EvaluatableFlag[]>(cacheKey);

        if (!flags) {
            flags = await this.flagRepository.findActiveByTenantAndEnv(
                tenantId,
                environment
            );

            await this.cacheService.set(
                cacheKey,
                flags,
                30
            );
        }

        const result: Record<string, unknown> = {};

        for (const flag of flags) {

            switch (flag.type) {

                case FlagType.BOOLEAN: {

                    const bucket = this.calculateBucket(
                        tenantId,
                        environment,
                        flag.key,
                        userId
                    );

                    result[flag.key] = this.rolloutEngine.evaluate(
                        flag,
                        bucket
                    );

                    break;
                }

                case FlagType.STRING:
                case FlagType.NUMBER:

                    // Configuration flags are returned as-is.
                    result[flag.key] = flag.defaultValue;

                    break;

                default:

                    throw new Error(
                        `Unsupported flag type '${flag.type}'.`
                    );
            }
        }

        return result;
    }

    async evaluateBulk(
        request: BulkEvaluationRequest
    ): Promise<Record<string, Record<string, unknown>>> {

        const results: Record<string, Record<string, unknown>> = {};

        for (const userId of request.userIds) {
            results[userId] = await this.evaluate({
                tenantId: request.tenantId,
                environment: request.environment,
                userId,
                context: request.context
            });
        }

        return results;
    }

    private calculateBucket(
        tenantId: string,
        environment: Environment,
        flagKey: string,
        userId: string
    ): number {

        const hash = crypto
            .createHash("sha256")
            .update(
                `${tenantId}:${environment}:${flagKey}:${userId}`
            )
            .digest("hex");

        return parseInt(hash.substring(0, 8), 16) % 100;
    }
}