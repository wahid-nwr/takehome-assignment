"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evaluation_service_1 = require("../../../src/modules/evaluation/evaluation.service");
describe('EvaluationService', () => {
    it('should create an instance', () => {
        const flagService = {};
        const rolloutEngine = {};
        const cacheService = {};
        const service = new evaluation_service_1.EvaluationService(flagService, rolloutEngine, cacheService);
        expect(service).toBeInstanceOf(evaluation_service_1.EvaluationService);
    });
});
