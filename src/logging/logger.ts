import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",

    timestamp: pino.stdTimeFunctions.isoTime,

    base: {
        service: "feature-flag-service",
    },

    formatters: {
        level(label) {
            return {
                severity: label.toUpperCase(),
            };
        },
    },
});

export default logger;