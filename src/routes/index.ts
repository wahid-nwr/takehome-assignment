import { Router } from 'express';

import { prisma } from '../shared/db/prisma';

import { TenantRepository } from '../modules/tenants/tenant.repository';
import { ApiKeyRepository } from '../modules/tenants/api-key.repository';
import { FlagRepository } from '../modules/flags/flag.repository';
import { AuditRepository } from '../modules/audit/audit.repository';

import { TenantService } from '../modules/tenants/tenant.service';
import { ApiKeyMiddleware } from "../shared/middleware/tenant-auth.middleware";
import { AdminApiKeyMiddleware } from "../shared/middleware/admin-api-key.middleware";
import { AuditService } from '../modules/audit/audit.service';
import { FlagService } from '../modules/flags/flag.service';
import { EvaluationService } from '../modules/evaluation/evaluation.service';

import { RolloutEngine } from '../modules/evaluation/rollout.engine';

import { AuditController } from '../modules/audit/audit.controller';
import { TenantController } from '../modules/tenants/tenant.controller';
import { FlagController } from '../modules/flags/flag.controller';
import { EvaluationController } from '../modules/evaluation/evaluation.controller';

import { createCacheService } from "../shared/cache/cache.factory";
import { register } from "../metrics/metrics";

import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../docs/openapi";

const router = Router();

const tenantRepository = new TenantRepository(prisma);

const apiKeyRepository = new ApiKeyRepository(prisma);

const flagRepository = new FlagRepository(prisma);

const auditRepository = new AuditRepository(prisma);

const tenantService = new TenantService(tenantRepository, apiKeyRepository);

const auditService = new AuditService(auditRepository, flagRepository);

const flagService = new FlagService(flagRepository, auditService);

const rolloutEngine = new RolloutEngine();

const cacheService = createCacheService();

const evaluationService = new EvaluationService(
    cacheService,
    flagRepository,
    rolloutEngine
);

const auditController = new AuditController(auditService);

const tenantController = new TenantController(tenantService);

const flagController = new FlagController(flagService);

const evaluationController = new EvaluationController(evaluationService);

const apiKeyMiddleware = new ApiKeyMiddleware(tenantService);

const adminApiKeyMiddleware = new AdminApiKeyMiddleware();

router.post(
    "/api/v1/tenants",
    adminApiKeyMiddleware.authenticate,
    tenantController.createTenant
);

router.get(
    "/api/v1/tenants/:tenantId/flags",
    apiKeyMiddleware.authenticate,
    flagController.getFlags
);

router.post(
    '/api/v1/tenants/:tenantId/flags',
    apiKeyMiddleware.authenticate,
    flagController.createFlag
);

router.put(
    '/api/v1/tenants/:tenantId/flags/:flagKey',
    apiKeyMiddleware.authenticate,
    flagController.updateFlag
);

router.delete(
    '/api/v1/tenants/:tenantId/flags/:flagKey',
    apiKeyMiddleware.authenticate,
    flagController.archiveFlag
);

router.post(
    "/api/v1/evaluate",
    apiKeyMiddleware.authenticate,
    evaluationController.evaluate
);

router.post(
    "/api/v1/evaluate/bulk",
    apiKeyMiddleware.authenticate,
    evaluationController.evaluateBulk
);

router.get(
    "/api/v1/tenants/:tenantId/flags/:flagKey/history",
    adminApiKeyMiddleware.authenticate,
    auditController.getHistory.bind(auditController)
);

router.get(
    "/metrics",
    adminApiKeyMiddleware.authenticate,
    async (req, res) => {
        res.setHeader("Content-Type", register.contentType);
        res.end(await register.metrics());
    }
);

router.get("/health", (req, res) => {
    res.json({
        status: "UP",
        timestamp: new Date().toISOString()
    });
});

router.get("/db", async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
        database: "connected"
    });
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;