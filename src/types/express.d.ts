import "express-serve-static-core";
import { AuthenticatedTenant } from "../shared/types/authenticated-tenant";

declare module "express-serve-static-core" {
    interface Request {
        correlationId?: string;
        tenant?: AuthenticatedTenant;
    }
}