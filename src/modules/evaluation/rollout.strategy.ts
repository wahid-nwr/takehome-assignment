export interface RolloutStrategy {
    evaluate(
        rolloutPercentage: number,
        defaultValue: boolean,
        bucket: number
    ): boolean;
}