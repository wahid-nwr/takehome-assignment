export const commonSchemas = {
    ErrorResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                example: false
            },

            error: {
                type: "string",
                example: "Validation failed"
            }
        }
    }
};