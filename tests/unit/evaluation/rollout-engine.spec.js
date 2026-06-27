"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rollout_engine_1 = require("../../../src/modules/evaluation/rollout.engine");
const flag = {
    key: 'new-ui',
    type: 'BOOLEAN',
    defaultValue: false,
    rolloutPercentage: 50,
    isActive: true
};
describe('RolloutEngine', () => {
    const engine = new rollout_engine_1.RolloutEngine();
    const flag = {
        key: 'new-ui',
        type: 'BOOLEAN',
        defaultValue: false,
        rolloutPercentage: 50,
        isActive: true
    };
    it('should always evaluate the same user consistently', () => {
        const first = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [flag]
        });
        const second = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [flag]
        });
        expect(first).toEqual(second);
    });
    it('should always return true for 100% rollout', () => {
        const result = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [
                {
                    ...flag,
                    rolloutPercentage: 100
                }
            ]
        });
        expect(result['new-ui']).toBe(true);
    });
    it('should always return false for 0% rollout', () => {
        const result = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [
                {
                    ...flag,
                    rolloutPercentage: 0
                }
            ]
        });
        expect(result['new-ui']).toBe(false);
    });
    it('should return default value when flag is inactive', () => {
        const result = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [
                {
                    ...flag,
                    isActive: false
                }
            ]
        });
        expect(result['new-ui']).toBe(false);
    });
    it('should evaluate multiple flags', () => {
        const result = engine.evaluate({
            tenantId: 'tenant1',
            environment: 'prod',
            userId: 'alice',
            flags: [
                {
                    ...flag,
                    key: 'new-ui'
                },
                {
                    ...flag,
                    key: 'new-dashboard'
                }
            ]
        });
        expect(result).toHaveProperty('new-ui');
        expect(result).toHaveProperty('new-dashboard');
    });
});
