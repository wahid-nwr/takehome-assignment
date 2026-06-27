import { RolloutStrategy } from "./rollout.strategy";

export class BooleanRolloutStrategy implements RolloutStrategy {

evaluate(
        rolloutPercentage: number,
        defaultValue: boolean,
        bucket: number
    ): boolean {

        if (bucket < rolloutPercentage) {
            return true;
        }

        return defaultValue;
    }
}