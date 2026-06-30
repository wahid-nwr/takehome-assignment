import { Environment, FeatureFlag, FlagType } from "@prisma/client";

import { EvaluationService } from "../../../src/modules/evaluation/evaluation.service";
import { FlagRepository } from "../../../src/modules/flags/flag.repository";
import { RolloutEngine } from "../../../src/modules/evaluation/rollout.engine";
import { CacheService } from "../../../src/shared/cache/cache.service";

function createFlag(
    overrides: Partial<FeatureFlag> = {}
): FeatureFlag {
    return {
        id: "flag-1",
        tenantId: "tenant-1",
        name: "New UI",
        key: "new-ui",
        description: null,
        type: FlagType.BOOLEAN,
        defaultValue: false,
        rolloutPercentage: 100,
        isActive: true,
        isArchived: false,
        environment: Environment.DEVELOPMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}

describe("EvaluationService", () => {
    let cacheService: jest.Mocked<CacheService>;
    let flagRepository: jest.Mocked<FlagRepository>;
    let rolloutEngine: jest.Mocked<RolloutEngine>;
    let service: EvaluationService;

    beforeEach(() => {
        cacheService = {
            get: jest.fn(),
            set: jest.fn()
        } as unknown as jest.Mocked<CacheService>;

        flagRepository = {
            findActiveByTenantAndEnv: jest.fn()
        } as unknown as jest.Mocked<FlagRepository>;

        rolloutEngine = {
            evaluate: jest.fn()
        } as unknown as jest.Mocked<RolloutEngine>;

        service = new EvaluationService(
            cacheService,
            flagRepository,
            rolloutEngine
        );
    });

    it("returns cached flags when available", async () => {

        cacheService.get.mockResolvedValue([
            createFlag({
                type: FlagType.STRING,
                defaultValue: "enabled"
            })
        ]);

        const result = await service.evaluate({
            tenantId: "tenant-1",
            environment: Environment.DEVELOPMENT,
            userId: "user-1",
            context: {}
        });

        expect(flagRepository.findActiveByTenantAndEnv)
            .not.toHaveBeenCalled();

        expect(result).toEqual({
            "new-ui": "enabled"
        });
    });

    it("loads flags from repository on cache miss", async () => {

        cacheService.get.mockResolvedValue(null);

        flagRepository.findActiveByTenantAndEnv.mockResolvedValue([
            createFlag({
                type: FlagType.STRING,
                defaultValue: "enabled"
            })
        ]);

        const result = await service.evaluate({
            tenantId: "tenant-1",
            environment: Environment.DEVELOPMENT,
            userId: "user-1",
            context: {}
        });

        expect(flagRepository.findActiveByTenantAndEnv)
            .toHaveBeenCalledWith(
                "tenant-1",
                Environment.DEVELOPMENT
            );

        expect(cacheService.set)
            .toHaveBeenCalled();

        expect(result).toEqual({
            "new-ui": "enabled"
        });
    });

    it("evaluates boolean flags using rollout engine", async () => {

        cacheService.get.mockResolvedValue([
            createFlag({
                type: FlagType.BOOLEAN,
                rolloutPercentage: 50,
                defaultValue: false
            })
        ]);

        rolloutEngine.evaluate.mockReturnValue(true);

        const result = await service.evaluate({
            tenantId: "tenant-1",
            environment: Environment.DEVELOPMENT,
            userId: "user-1",
            context: {}
        });

        expect(rolloutEngine.evaluate)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            "new-ui": true
        });
    });
});