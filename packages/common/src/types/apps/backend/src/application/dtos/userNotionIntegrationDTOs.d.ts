export interface CreateUserNotionIntegrationInput {
    integrationName: string;
    notionIntegrationToken: string;
    userId: string;
}
export interface CreateUserNotionIntegrationOutput {
    id: string;
    integrationName: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ListUserNotionIntegrationsInput {
    userId: string;
}
export interface ListUserNotionIntegrationsOutputItem {
    id: string;
    integrationName: string;
    createdAt: Date;
    updatedAt: Date;
}
export type ListUserNotionIntegrationsOutput = ListUserNotionIntegrationsOutputItem[];
export interface DeleteUserNotionIntegrationInput {
    integrationId: string;
    userId: string;
}
export interface DeleteUserNotionIntegrationOutput {
    success: boolean;
    message?: string;
}
