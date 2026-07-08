export const evaluationSchemas = {
    EvaluationRequest: {
        type: "object",

        required: [
            "environment",
            "userId"
        ],

        properties: {
            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"],
                example: "PRODUCTION"
            },

            userId: {
                type: "string",
                example: "user-123"
            },

            context: {
                type: "object",
                description: "Arbitrary targeting context (not currently used in bucket calculation, but accepted for forward compatibility).",
                additionalProperties: true
            }
        }
    },

    EvaluationResponse: {
        type: "object",

        description: "Map of flag key -> evaluated value for every active flag in the tenant/environment. Value type depends on the flag's `type` (boolean for BOOLEAN flags, the configured default for STRING/NUMBER flags).",

        additionalProperties: true,

        example: {
            "checkout-redesign": true,
            "max-cart-items": 20
        }
    },

    BulkEvaluationRequest: {
        type: "object",

        required: [
            "environment",
            "userIds"
        ],

        properties: {
            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"],
                example: "PRODUCTION"
            },

            userIds: {
                type: "array",
                items: {
                    type: "string"
                },
                example: ["user-123", "user-456"]
            },

            context: {
                type: "object",
                additionalProperties: true
            }
        }
    },

    BulkEvaluationResponse: {
        type: "object",

        description: "Map of userId -> that user's EvaluationResponse (flag key -> evaluated value).",

        additionalProperties: {
            type: "object",
            additionalProperties: true
        },

        example: {
            "user-123": { "checkout-redesign": true },
            "user-456": { "checkout-redesign": false }
        }
    }
};