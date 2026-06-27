import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden.error';

export const validateTenantAccess = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const requestedTenantId = req.params.tenantId;
    const authenticatedTenantId = req.tenant?.id;
    if (
        requestedTenantId &&
        authenticatedTenantId &&
        requestedTenantId !== authenticatedTenantId
    ) {
        return next(new ForbiddenError('Tenant access denied'));
    }
    next();
};