import client from "prom-client";

client.collectDefaultMetrics();

export const register = new client.Registry();

register.setDefaultLabels({
    service: "feature-flag-service",
});

client.collectDefaultMetrics({
    register,
});

export const evaluationRequestsTotal = new client.Counter({
    name: "evaluation_requests_total",
    help: "Total number of feature flag evaluation requests.",
    registers: [register],
});

export const evaluationErrorsTotal = new client.Counter({
    name: "evaluation_errors_total",
    help: "Total number of failed feature flag evaluations.",
    registers: [register],
});

export const cacheHitsTotal = new client.Counter({
    name: "feature_flag_cache_hits_total",
    help: "Total number of cache hits.",
    registers: [register],
});

export const cacheMissesTotal = new client.Counter({
    name: "feature_flag_cache_misses_total",
    help: "Total number of cache misses.",
    registers: [register],
});