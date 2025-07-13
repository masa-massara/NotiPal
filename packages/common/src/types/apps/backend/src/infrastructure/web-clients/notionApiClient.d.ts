import type { CacheService } from "../../application/services/cacheService";
import type { AccessibleNotionDatabase, // Import new interface
NotionApiService, NotionDatabaseSchema } from "../../domain/services/notionApiService";
export declare class NotionApiClient implements NotionApiService {
    private cacheService;
    constructor(cacheService: CacheService);
    getDatabaseSchema(databaseId: string, userNotionToken: string): Promise<NotionDatabaseSchema | null>;
    private mapResponseToSchema;
    listAccessibleDatabases(userNotionToken: string): Promise<AccessibleNotionDatabase[]>;
}
