import { EvaluatableFlag } from "./models/evaluatable-flag";
import { BooleanRolloutStrategy } from "./boolean.rollout";
import { FlagType } from "@prisma/client";

export class RolloutEngine {

constructor(
        private readonly booleanStrategy = new BooleanRolloutStrategy()
    ) {}

    evaluate(
        flag: EvaluatableFlag,
        bucket: number
    ): unknown {

        switch (flag.type) {

            case FlagType.BOOLEAN:

                return this.booleanStrategy.evaluate(
                    flag.rolloutPercentage,
                    flag.defaultValue as boolean,
                    bucket
                );

            case FlagType.STRING:

                return flag.defaultValue;

            case FlagType.NUMBER:

                return flag.defaultValue;

            default:

                throw new Error(
                    `Unsupported flag type '${flag.type}'.`
                );
        }
    }
}