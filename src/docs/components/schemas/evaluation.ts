export const evaluationSchemas = {
    EvaluationRequest: {
        type: "object",

        required: [
            "flagKey",
            "userId"
        ],

        properties: {
            flagKey: {
                type: "string",
                example: "checkout-redesign"
            },

            userId: {
                type: "string",
                example: "user-123"
            }
        }
    },

    EvaluationResponse: {
        type: "object",

        properties: {
            enabled: {
                type: "boolean",
                example: true
            }
        }
    }
};