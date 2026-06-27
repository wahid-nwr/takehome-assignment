type FeatureFlag = {
    id: string;
    tenantId: string;
    key: string;
    type: 'boolean' | 'string' | 'number';
    defaultValue: any;
    rolloutPercentage: number;
    isActive: boolean;
    environment: 'dev' | 'staging' | 'prod';
};