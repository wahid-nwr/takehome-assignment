import { FlagType } from "@prisma/client";
import { CreateFlagRequest } from "./dto/create-flag.request";
import { UpdateFlagRequest } from "./dto/update-flag.request";
import { ValidationError } from "../../shared/errors/validation.error";

export class FlagValidator {

    private static readonly KEY_REGEX = /^[a-z0-9-]+$/;

    static validateCreate(dto: CreateFlagRequest): void {
        this.validateKey(dto.key);
        this.validateName(dto.name);
        this.validateDescription(dto.description);
        this.validateRollout(dto.rolloutPercentage);
        this.validateDefaultValue(dto.type, dto.defaultValue);
    }

    static validateUpdate(
        dto: UpdateFlagRequest,
        currentType: FlagType
    ): void {

        if (dto.key !== undefined) {
            this.validateKey(dto.key);
        }

        if (dto.name !== undefined) {
            this.validateName(dto.name);
        }

        if (dto.description !== undefined) {
            this.validateDescription(dto.description);
        }

        if (dto.rolloutPercentage !== undefined) {
            this.validateRollout(dto.rolloutPercentage);
        }

        const effectiveType = dto.type ?? currentType;

        if (dto.defaultValue !== undefined) {
            this.validateDefaultValue(
                effectiveType,
                dto.defaultValue
            );
        }
    }

    private static validateKey(key: string): void {

        key = key.trim();

        if (!key) {
            throw new ValidationError("Flag key is required.");
        }

        if (!this.KEY_REGEX.test(key)) {
            throw new ValidationError(
                "Flag key may only contain lowercase letters, numbers and hyphens."
            );
        }
    }

    private static validateName(name: string): void {

        name = name.trim();

        if (!name) {
            throw new ValidationError("Flag name is required.");
        }

        if (name.length < 3 || name.length > 100) {
            throw new ValidationError(
                "Flag name must be between 3 and 100 characters."
            );
        }
    }

    private static validateDescription(description?: string): void {

        if (description && description.length > 500) {
            throw new ValidationError(
                "Description must not exceed 500 characters."
            );
        }
    }

    private static validateRollout(rollout: number): void {

        if (!Number.isInteger(rollout)) {
            throw new ValidationError(
                "Rollout percentage must be an integer."
            );
        }

        if (rollout < 0 || rollout > 100) {
            throw new ValidationError(
                "Rollout percentage must be between 0 and 100."
            );
        }
    }

    private static validateDefaultValue(
        type: FlagType,
        value: unknown
    ): void {

        switch (type) {

            case FlagType.BOOLEAN:

                if (typeof value !== "boolean") {
                    throw new ValidationError(
                        "Default value must be a boolean."
                    );
                }

                break;

            case FlagType.STRING:

                if (typeof value !== "string") {
                    throw new ValidationError(
                        "Default value must be a string."
                    );
                }

                break;

            case FlagType.NUMBER:

                if (typeof value !== "number" || Number.isNaN(value)) {
                    throw new ValidationError(
                        "Default value must be a valid number."
                    );
                }

                break;

            default:

                throw new ValidationError(
                    `Unsupported flag type '${type}'.`
                );
        }
    }
}