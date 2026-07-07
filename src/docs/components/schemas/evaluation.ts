export const evaluationSchemas = {
    EvaluationRequest: {
        type: "object",

        required: [
            "environment",
            "userId",
            "context"
        ],

        properties: {
            environment: {
                type: "string",
                enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"],
                example: "DEVELOPMENT"
            },

            userId: {
                type: "string",
                example: "user-123"
            },

            context: {
                type: "string",
                example: "user-123"
            }
        }
    },

    EvaluationResponse: {
        type: "object",

        properties: {
            flag: {
                type: "boolean",
                example: true
            }
        }
    }
};