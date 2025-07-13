export interface ListNotionDatabasesInput {
    integrationId: string;
    userId: string;
}
export interface NotionDatabaseOutputItem {
    id: string;
    name: string;
}
export interface ListNotionDatabasesOutput extends Array<NotionDatabaseOutputItem> {
}
export interface GetNotionDatabasePropertiesInput {
    databaseId: string;
    userId: string;
    integrationId?: string;
}
export interface NotionPropertyOption {
    id: string;
    name: string;
    color?: string;
}
export interface NotionPropertyOutputItem {
    id: string;
    name: string;
    type: string;
    options?: NotionPropertyOption[];
}
export interface GetNotionDatabasePropertiesOutput extends Array<NotionPropertyOutputItem> {
}
