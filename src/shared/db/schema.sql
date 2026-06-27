CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    key_hash TEXT NOT NULL UNIQUE,
    name TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP NULL
);

CREATE TABLE feature_flags (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,

    type TEXT NOT NULL CHECK (type IN ('boolean', 'string', 'number')),

    default_value JSONB NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, key)
);

CREATE TABLE flag_rules (
    id UUID PRIMARY KEY,

    flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,

    environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),

    rollout_percentage INT NOT NULL DEFAULT 0,

    targeting_rules JSONB NULL,

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE flag_audit_logs (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    flag_id UUID NOT NULL,

    action TEXT NOT NULL,
    -- CREATED | UPDATED | ARCHIVED | RULE_CHANGED

    previous_value JSONB NULL,
    new_value JSONB NULL,

    changed_by TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE flag_evaluation_cache (
    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL,
    flag_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    environment TEXT NOT NULL,

    evaluated_value JSONB NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, flag_id, user_id, environment)
);

CREATE INDEX idx_flags_tenant_key
ON feature_flags(tenant_id, key);

CREATE INDEX idx_rules_flag_env
ON flag_rules(flag_id, environment);

CREATE INDEX idx_audit_flag
ON flag_audit_logs(flag_id, created_at DESC);

CREATE INDEX idx_eval_lookup
ON flag_evaluation_cache(tenant_id, user_id, environment);