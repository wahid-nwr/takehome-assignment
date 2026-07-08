import { commonSchemas } from "./components/schemas/common";
import { tenantSchemas } from "./components/schemas/tenant";
import { flagSchemas } from "./components/schemas/flag";
import { evaluationSchemas } from "./components/schemas/evaluation";
import { auditSchemas } from "./components/schemas/audit";

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
        { name: "Evaluation" },
        { name: "Audit" }
    ],

    components: {
        securitySchemes: {
            AdminBearerAuth: {
                type: "http",
                scheme: "bearer",
                description: "Service-level admin key (SERVICE_API_KEY), sent as 'Authorization: Bearer <key>'. Distinct from per-tenant ApiKeyAuth."
            },
            TenantBearerAuth: {
                type: "http",
                scheme: "bearer",
                description: "Tenant bearer key"
            }
        },

        schemas: {
            ...commonSchemas,
            ...tenantSchemas,
            ...flagSchemas,
            ...evaluationSchemas,
            ...auditSchemas
        }
    },

    security: [
        {
            TenantBearerAuth: []
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
                description: "Requires the service-level admin key, not a tenant API key.",
                security: [
                    { AdminBearerAuth: [] }
                ],
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

        "/api/v1/tenants/{tenantId}/flags": {
            get: {
                tags: ["Flags"],
                summary: "List flags",
                parameters: [
                    {
                        name: "tenantId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" }
                    },
                    {
                        name: "environment",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"]
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "List of flags",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Flag" }
                                }
                            }
                        }
                    }
                }
            },

            post: {
                tags: ["Flags"],
                summary: "Create a feature flag",
                parameters: [
                    {
                        name: "tenantId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateFlagRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Flag created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Flag"
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
                summary: "Evaluate all active flags for a user",
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
                        description: "Evaluated flag values, keyed by flag key",
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
        },

        "/api/v1/evaluate/bulk": {
            post: {
                tags: ["Evaluation"],
                summary: "Evaluate all active flags for multiple users in one request",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/BulkEvaluationRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Evaluated flag values per user, keyed by userId",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/BulkEvaluationResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/tenants/{tenantId}/flags/{flagKey}": {
            put: {
                tags: ["Flags"],
                summary: "Update a feature flag",
                description: "All fields are optional — only supplied fields are updated. Note: changing `environment` moves the flag out of its `(tenantId, key, environment)` unique slot, so consider whether that's really intended vs. creating a new flag in the target environment.",
                parameters: [
                    {
                        name: "tenantId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" }
                    },
                    {
                        name: "flagKey",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "checkout-redesign"
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UpdateFlagRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Updated flag",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Flag"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Flag not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Flags"],
                summary: "Archive (soft-delete) a feature flag",
                parameters: [
                    {
                        name: "tenantId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" }
                    },
                    {
                        name: "flagKey",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "checkout-redesign"
                    }
                ],
                responses: {
                    "204": {
                        description: "Flag archived (no content)"
                    },
                    "404": {
                        description: "Flag not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/tenants/{tenantId}/flags/{flagKey}/history": {
            get: {
                tags: ["Audit"],
                summary: "Get chronological change history for a flag",
                description: "Requires the service-level admin key, not a tenant API key.",
                security: [
                    { AdminBearerAuth: [] }
                ],
                parameters: [
                    {
                        name: "tenantId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" }
                    },
                    {
                        name: "flagKey",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "checkout-redesign"
                    },
                    {
                        name: "environment",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            enum: ["DEVELOPMENT", "STAGING", "PRODUCTION"]
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Audit log entries, most recent first",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/AuditLog" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};