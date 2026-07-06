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

            enabled: {
            type: "boolean",
            example: true
            },

            rolloutPercentage: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            example: 50
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

            enabled: {
                type: "boolean"
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100
            }
        }
    },

    UpdateFlagRequest: {
        type: "object",

        properties: {
            enabled: {
                type: "boolean"
            },

            rolloutPercentage: {
                type: "integer",
                minimum: 0,
                maximum: 100
            }
        }
    }
};