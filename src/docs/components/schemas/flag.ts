export const flagSchemas = {
    Flag: {
        type: "object",

        properties: {
            id: {
                type: "string",
                format: "uuid"
            },

            key: {
                type: "string",
                example: "checkout-redesign"
            },

            name: {
                type: "string",
                example: "checkout-redesign"
            },

            type: {
                type: "string",
                enum: ["BOOLEAN", "STRING", "NUMBER"],
                example: "BOOLEAN"
            },

            defaultValue: {
                type: "string",
                example: "true"
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
            }
        }
    },

    CreateFlagRequest: {
        type: "object",

        required: [
            "key",
            "enabled"
        ],

        properties: {
            key: {
                type: "string"
            },

            name: {
                type: "string"
            },

            type: {
                type: "string",
                enum: ["BOOLEAN", "STRING", "NUMBER"]
            },

            defaultValue: {
                type: "string"
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100
            },

            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"]
            }
        }
    },

    UpdateFlagRequest: {
        type: "object",

        properties: {
            defaultValue: {
                type: "string"
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100
            }
        }
    }
};