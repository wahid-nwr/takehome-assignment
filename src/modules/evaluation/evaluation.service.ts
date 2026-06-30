import crypto from "crypto";

import { CacheService } from "../../shared/cache/cache.service";
import { FlagRepository } from "./../flags/flag.repository";
import { RolloutEngine } from "./rollout.engine";
import { Environment, FlagType } from "@prisma/client";
import { EvaluationRequest } from "./evaluation-request";
import { BulkEvaluationRequest } from "./dto/bulk-evaluation-request";
import { FeatureFlag } from "@prisma/client";

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


        let flags = await this.cacheService.get<FeatureFlag[]>(cacheKey);

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

        console.log(flags);
        for (const flag of flags) {
            console.log("Flag type:", flag.type);
            console.log("FlagType.STRING:", FlagType.STRING);
            console.log("Default value:", flag.defaultValue);
            switch (flag.type) {

                case FlagType.BOOLEAN: {
                    console.log("BOOLEAN");
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
                    console.log("Assigned:", result);
                    break;
                }

                case FlagType.STRING:
                    console.log("STRING");
                    result[flag.key] = flag.defaultValue;
                    console.log("Assigned:", result);
                    break;

                case FlagType.NUMBER:
                    console.log("NUMBER");
                    // Configuration flags are returned as-is.
                    result[flag.key] = flag.defaultValue;
                    console.log("Assigned:", result);
                    break;

                default:
                    console.log("DEFAULT");
                    throw new Error(
                        `Unsupported flag type '${flag.type}'.`
                    );
            }
        }
        console.log("Returning:", result);
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