export declare class UserNotionIntegration {
    id: string;
    userId: string;
    integrationName: string;
    notionIntegrationToken: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(userId: string, integrationName: string, notionIntegrationToken: string, id?: string, createdAt?: Date, updatedAt?: Date);
    updateIntegrationName(newName: string): void;
    updateNotionIntegrationToken(newToken: string): void;
}
