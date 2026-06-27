export interface EvaluatableFlag {
    key: string;
    type: 'BOOLEAN' | 'STRING' | 'NUMBER';
    defaultValue: unknown;
    rolloutPercentage: number;
}