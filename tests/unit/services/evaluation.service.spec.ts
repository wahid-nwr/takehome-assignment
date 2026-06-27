import { EvaluationService } from '../../../src/modules/evaluation/evaluation.service';

describe('EvaluationService', () => {
    it('should create an instance', () => {
        const flagService = {} as any;
        const rolloutEngine = {} as any;
        const cacheService = {} as any;

        const service = new EvaluationService(
            flagService,
            rolloutEngine,
            cacheService
        );

        expect(service).toBeInstanceOf(EvaluationService);
    });
});