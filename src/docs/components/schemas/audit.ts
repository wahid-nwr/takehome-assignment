export const auditSchemas = {
    AuditLog: {
        type: "object",

        properties: {
            id: {
                type: "string",
                format: "uuid"
            },

            action: {
                type: "string",
                enum: ["CREATED", "UPDATED", "ARCHIVED"],
                example: "UPDATED"
            },

            previousValue: {
                type: "object",
                nullable: true,
                additionalProperties: true
            },

            newValue: {
                type: "object",
                nullable: true,
                additionalProperties: true
            },

            changedBy: {
                type: "string",
                nullable: true,
                example: "user@example.com"
            },

            createdAt: {
                type: "string",
                format: "date-time"
            }
        }
    }
};