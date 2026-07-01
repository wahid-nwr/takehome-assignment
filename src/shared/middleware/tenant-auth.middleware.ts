import { Request, Response, NextFunction } from "express";
import { TenantService } from "../../modules/tenants/tenant.service";
import { UnauthorizedError } from "../errors/unauthorized.error";

export class ApiKeyMiddleware {

constructor(
        private readonly tenantService: TenantService
    ) {}

    authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {
            const authHeader = req.header("Authorization");

            if (!authHeader?.startsWith("Bearer ")) {
                return next(new UnauthorizedError("Missing or invalid Authorization header"));
            }

            const apiKey = authHeader.substring("Bearer ".length);

            const tenant = await this.tenantService.resolveTenantByApiKey(apiKey);

            if (!tenant) {
                return next(new UnauthorizedError("Invalid API key"));
            }

            req.tenant = tenant;

            next();

        } catch (err) {
            next(err);
        }
    };
}