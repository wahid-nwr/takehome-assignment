export const flagSchemas = {
    Flag: {
        type: "object",

        properties: {
            id: {
                type: "string",
                format: "uuid"
            },

            tenantId: {
                type: "string",
                format: "uuid"
            },

            key: {
                type: "string",
                example: "checkout-redesign"
            },

            name: {
                type: "string",
                example: "Checkout Redesign"
            },

            description: {
                type: "string",
                nullable: true,
                example: "Rolls out the new one-page checkout flow"
            },

            type: {
                type: "string",
                enum: ["BOOLEAN", "STRING", "NUMBER"],
                example: "BOOLEAN"
            },

            defaultValue: {
                description: "Default value returned when a user isn't in the rollout. Shape depends on `type` (boolean for BOOLEAN, string for STRING, number for NUMBER).",
                example: false
            },

            isActive: {
                type: "boolean",
                description: "Whether the flag is currently toggled on.",
                example: true
            },

            isArchived: {
                type: "boolean",
                description: "Soft-delete flag. Archived flags are excluded from evaluation and default list views.",
                example: false
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                example: 50
            },

            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"],
                example: "DEVELOPMENT"
            },

            createdAt: {
                type: "string",
                format: "date-time"
            },

            updatedAt: {
                type: "string",
                format: "date-time"
            }
        }
    },

    CreateFlagRequest: {
        type: "object",

        required: [
            "key",
            "name",
            "type",
            "defaultValue",
            "environment",
            "rolloutPercentage"
        ],

        properties: {
            key: {
                type: "string",
                example: "checkout-redesign"
            },

            name: {
                type: "string",
                example: "Checkout Redesign"
            },

            description: {
                type: "string",
                example: "Rolls out the new one-page checkout flow"
            },

            type: {
                type: "string",
                enum: ["BOOLEAN", "STRING", "NUMBER"],
                example: "BOOLEAN"
            },

            defaultValue: {
                description: "Must match `type` (boolean/string/number).",
                example: false
            },

            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"],
                example: "DEVELOPMENT"
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                example: 0
            }
        }
    },

    UpdateFlagRequest: {
        type: "object",

        description: "All fields optional — only what's supplied gets updated.",

        properties: {
            key: {
                type: "string"
            },

            name: {
                type: "string"
            },

            description: {
                type: "string"
            },

            type: {
                type: "string",
                enum: ["BOOLEAN", "STRING", "NUMBER"]
            },

            defaultValue: {
                description: "Must match `type` (boolean/string/number)."
            },

            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"]
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100
            },

            isActive: {
                type: "boolean"
            }
        }
    }
};