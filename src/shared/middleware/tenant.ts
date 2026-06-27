import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../../modules/tenants/tenant.service';
import { UnauthorizedError } from '../errors/unauthorized.error';

export class TenantAuthMiddleware {

    constructor(
        private tenantService: TenantService
    ) {}

    authenticate = async (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            const apiKey = req.header('x-api-key');

            if (!apiKey) {
                throw new UnauthorizedError(
                    'Missing x-api-key header'
                );
            }

            const tenant = await this.tenantService.resolveTenantByApiKey(apiKey);

            if (!tenant) {
                throw new UnauthorizedError("Invalid API key");
            }

            req.tenant = {
                id: tenant.id,
                name: tenant.name
            };

            next();

        } catch (error) {
            next(error);
        }
    };
}