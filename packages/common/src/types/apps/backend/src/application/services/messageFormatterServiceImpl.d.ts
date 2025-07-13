import type { MessageFormatterService } from "../../domain/services/messageFormatterService";
import type { NotionDatabaseSchema } from "../../domain/services/notionApiService";
type NotionPagePropertyValue = any;
type NotionPageProperties = Record<string, NotionPagePropertyValue>;
export declare class MessageFormatterServiceImpl implements MessageFormatterService {
    constructor();
    format(templateBody: string, pageProperties: NotionPageProperties, databaseSchema: NotionDatabaseSchema, pageUrl?: string): Promise<string>;
}
export {};
