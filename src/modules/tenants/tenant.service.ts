import { randomUUID } from "crypto";
import { HashUtil } from "../../shared/utils/hash.util";
import { ConflictError } from "../../shared/errors/conflict.error";
import { ApiKeyRepository } from "./api-key.repository";
import { TenantRepository } from "./tenant.repository";

export class TenantService {

constructor(
        private readonly tenantRepo: TenantRepository,
        private readonly apiKeyRepo: ApiKeyRepository
    ) {}

    async createTenant(name: string) {
        const existing = await this.getTenantByName(name);

        if (existing) throw new ConflictError("Tenant already exists");

        const tenant = await this.tenantRepo.create(name);

        // generate raw key (ONLY TIME YOU SEE IT)
        const apiKey = randomUUID();

        const keyHash = HashUtil.sha256(apiKey);

        await this.apiKeyRepo.create(tenant.id, keyHash);

        return {
            tenant,
            apiKey: apiKey,
            message: "Store this API key securely. It will not be shown again."
        };
    }

    async resolveTenantByApiKey(apiKey: string) {
        const keyHash = HashUtil.sha256(apiKey);
        const apiKeyRecord = await this.apiKeyRepo.findTenantByKeyHash(keyHash);
        return apiKeyRecord?.tenant ?? null;
    }

    async getTenantById(id: string) {
        return this.tenantRepo.findById(id);
    }

    async getTenantByName(name: string) {
        return this.tenantRepo.findByName(name);
    }

    async revokeApiKey(apiKeyId: string) {
        return this.apiKeyRepo.revoke(apiKeyId);
    }
}