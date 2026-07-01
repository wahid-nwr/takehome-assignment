import { AdminApiKeyMiddleware } from "./admin-api-key.middleware";

export class AdminAuthenticationService {
    authenticate(apiKey: string): boolean {
        return apiKey === process.env.SERVICE_API_KEY;
    }
}