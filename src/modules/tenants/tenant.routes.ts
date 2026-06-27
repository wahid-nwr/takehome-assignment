import { Router } from 'express';
import { TenantController } from './tenant.controller';

export const tenantRoutes = (controller: TenantController) => {

const router = Router();

router.post(
        '/',
        controller.createTenant
    );

    router.get(
        '/:id',
        controller.getTenant
    );

    router.post(
        '/:id/api-keys/:keyId/revoke',
        controller.revokeApiKey
    );

    return router;
};