import { commonSchemas } from "./components/schemas/common";
import { tenantSchemas } from "./components/schemas/tenant";
import { flagSchemas } from "./components/schemas/flag";
import { evaluationSchemas } from "./components/schemas/evaluation";

export const openApiSpec = {
    openapi: "3.1.0",

    info: {
        title: "Feature Flag Service",
        version: "1.0.0",
        description:
        "A multi-tenant feature flag management and evaluation service."
    },

    servers: [
        {
            url: "/",
            description: "Current environment"
        }
    ],

    tags: [
        { name: "Health" },
        { name: "Tenants" },
        { name: "Flags" },
        { name: "Evaluation" }
    ],

    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key"
            }
        },

        schemas: {
            ...commonSchemas,
            ...tenantSchemas,
            ...flagSchemas,
            ...evaluationSchemas
        }
    },

    security: [
        {
            ApiKeyAuth: []
        }
    ],

    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health check",
                responses: {
                    "200": {
                        description: "OK"
                    }
                }
            }
        },

        "/api/v1/tenants": {
            post: {
                tags: ["Tenants"],
                summary: "Create tenant",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateTenantRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Tenant created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Tenant"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/evaluate": {
            post: {
                tags: ["Evaluation"],
                summary: "Evaluate feature flag",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/EvaluationRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Evaluation result",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/EvaluationResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};