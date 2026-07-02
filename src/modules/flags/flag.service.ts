import { AuditAction } from "../audit/audit-action";
import { AuditService } from "../audit/audit.service";
import { FlagRepository } from "./flag.repository";
import { CreateFlagRequest } from "./dto/create-flag.request";
import { UpdateFlagRequest } from "./dto/update-flag.request";
import { FlagValidator } from "./flag.validator";

import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/notfound.error";
import { ValidationError } from "../../shared/errors/validation.error";
import { Environment, Prisma } from "@prisma/client";

export class FlagService {

    constructor(
        private readonly flagRepository: FlagRepository,
        private readonly auditService: AuditService
    ) {}

    async createFlag(
        tenantId: string,
        request: CreateFlagRequest
    ) {

        if (!Object.values(Environment).includes(request.environment)) {
            throw new ValidationError("Invalid environment.");
        }

        request.key = request.key.trim();
        request.name = request.name.trim();
        request.description = request.description?.trim();

        FlagValidator.validateCreate(request);

        const existing =
            await this.flagRepository.findByKey(
                tenantId,
                request.key,
                request.environment
            );

        if (existing) {
            throw new ConflictError(
                `Feature flag '${request.key}' already exists.`
            );
        }

        const flag =
            await this.flagRepository.create({
                tenantId,
                ...request,
                defaultValue:
                    request.defaultValue as Prisma.InputJsonValue
            });

        await this.auditService.log({
            tenantId,
            flagId: flag.id,
            action: AuditAction.CREATED,
            newValue: flag
        });

        return flag;
    }

    async getFlags(
        tenantId: string,
        environment?: Environment
    ) {
        return this.flagRepository.findByTenant(
            tenantId,
            environment
        );
    }

    async getActiveFlags(
        tenantId: string,
        environment: Environment
    ) {
        return this.flagRepository.findActiveByTenantAndEnv(
            tenantId,
            environment
        );
    }

    async updateFlag(
        tenantId: string,
        flagKey: string,
        request: UpdateFlagRequest
    ) {
        const existing =
            await this.flagRepository.findByKey(
                tenantId,
                flagKey
            );

        if (!existing) {
            throw new NotFoundError(
                "Feature flag not found."
            );
        }

        request.key = request.key?.trim();
        request.name = request.name?.trim();
        request.description = request.description?.trim();

        FlagValidator.validateUpdate(
            request,
            existing.type
        );

        if (
            request.key &&
            request.key !== existing.key
        ) {
            const duplicate =
                await this.flagRepository.findByKey(
                    tenantId,
                    request.key,
                    existing.environment
                );

            if (duplicate) {
                throw new ConflictError(
                    `Feature flag '${request.key}' already exists.`
                );
            }
        }
        const flagId = existing.id;
        const updated =
            await this.flagRepository.update(
                tenantId,
                flagId,
                request
            );

        await this.auditService.log({
            tenantId,
            flagId,
            action: AuditAction.UPDATED,
            previousValue: existing,
            newValue: updated
        });

        return updated;
    }

    async archiveFlag(
        tenantId: string,
        flagKey: string
    ) {

        const existing =
            await this.flagRepository.findByKey(
                tenantId,
                flagKey
            );

        if (!existing) {
            throw new NotFoundError(
                "Feature flag not found."
            );
        }
        const flagId = existing.id;
        const archived =
            await this.flagRepository.archive(
                tenantId,
                flagId
            );

        await this.auditService.log({
            tenantId,
            flagId,
            action: AuditAction.ARCHIVED,
            previousValue: existing,
            newValue: archived
        });

        return archived;
    }
}