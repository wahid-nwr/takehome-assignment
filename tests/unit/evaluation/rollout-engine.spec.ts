import { RolloutEngine } from "../../../src/modules/evaluation/rollout.engine";
import { FlagType } from "@prisma/client";

describe("RolloutEngine", () => {

    const engine = new RolloutEngine();

    it("returns true when bucket is within rollout percentage", () => {

        const result = engine.evaluate(
            {
                key: "new-ui",
                type: FlagType.BOOLEAN,
                defaultValue: false,
                rolloutPercentage: 50
            },
            25
        );

        expect(result).toBe(true);
    });

    it("returns default value when bucket is outside rollout", () => {

        const result = engine.evaluate(
            {
                key: "new-ui",
                type: FlagType.BOOLEAN,
                defaultValue: false,
                rolloutPercentage: 50
            },
            75
        );

        expect(result).toBe(false);
    });

    it("returns default value when rollout is 0%", () => {

        const result = engine.evaluate(
            {
                key: "new-ui",
                type: FlagType.BOOLEAN,
                defaultValue: false,
                rolloutPercentage: 0
            },
            50
        );

        expect(result).toBe(false);
    });

    it("returns true when rollout is 100%", () => {

        const result = engine.evaluate(
            {
                key: "new-ui",
                type: FlagType.BOOLEAN,
                defaultValue: false,
                rolloutPercentage: 100
            },
            50
        );

        expect(result).toBe(true);
    });

    it("returns the configured default when default value is true", () => {

        const result = engine.evaluate(
            {
                key: "new-ui",
                type: FlagType.BOOLEAN,
                defaultValue: true,
                rolloutPercentage: 0
            },
            50
        );

        expect(result).toBe(true);
    });

});