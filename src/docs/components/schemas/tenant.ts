export const tenantSchemas = {
    Tenant: {
        type: "object",

        properties: {
            id: {
            type: "string",
            format: "uuid"
            },

            name: {
            type: "string",
            example: "Acme"
            },

            apiKey: {
            type: "string",
            example: "ff_live_xxxxxxxxx"
            },

            createdAt: {
            type: "string",
            format: "date-time"
            }
        }
    },

    CreateTenantRequest: {
        type: "object",

        required: ["name"],

        properties: {
            name: {
            type: "string",
            example: "Acme"
            }
        }
    }
};