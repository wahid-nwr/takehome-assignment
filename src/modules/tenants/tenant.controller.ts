import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { NotFoundError } from "../../shared/errors/notfound.error";

export class TenantController {

constructor(
        private readonly tenantService: TenantService
    ) {}

    createTenant = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const { name } = req.body;

            const result =
                await this.tenantService.createTenant(name);

            res.status(201).json({
                tenant: {
                    id: result.tenant.id,
                    name: result.tenant.name,
                    createdAt: result.tenant.createdAt
                },

                // IMPORTANT: return only once
                apiKey: result.apiKey
            });

        } catch (error) {
            next(error);
        }
    };

    getTenant = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const tenant =
                await this.tenantService.getTenantById(
                    req.params.id
                );

            if (!tenant) {
                throw new NotFoundError("Tenant not found");
            }

            res.json(tenant);

        } catch (error) {
            next(error);
        }
    };

    revokeApiKey = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const apiKeyId = req.params.keyId;

            await this.tenantService.revokeApiKey(apiKeyId);

            res.status(204).send();

        } catch (error) {
            next(error);
        }
    };
}