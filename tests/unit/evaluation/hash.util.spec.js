"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_util_1 = require("../../../src/modules/evaluation/hash.util");
describe('HashUtil', () => {
    it('should always return the same bucket for the same input', () => {
        const first = hash_util_1.HashUtil.bucket('tenant1:prod:new-ui:user123');
        const second = hash_util_1.HashUtil.bucket('tenant1:prod:new-ui:user123');
        expect(first).toBe(second);
    });
    it('should return a value between 0 and 99', () => {
        const bucket = hash_util_1.HashUtil.bucket('anything');
        expect(bucket).toBeGreaterThanOrEqual(0);
        expect(bucket).toBeLessThan(100);
    });
    it('should generate different buckets for different users', () => {
        const alice = hash_util_1.HashUtil.bucket('tenant1:prod:new-ui:alice');
        const bob = hash_util_1.HashUtil.bucket('tenant1:prod:new-ui:bob');
        expect(alice).not.toBe(bob);
    });
});
