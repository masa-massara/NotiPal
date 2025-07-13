import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { MessageFormatterService } from "../../domain/services/messageFormatterService";
import type { NotificationClient } from "../../domain/services/notificationClient";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { EncryptionService } from "../services/encryptionService";
type NotionPageProperties = Record<string, any>;
export interface ProcessNotionWebhookInputData {
    object: string;
    id: string;
    parent?: {
        type: string;
        database_id?: string;
        page_id?: string;
        workspace?: boolean;
    };
    properties?: NotionPageProperties;
    url?: string;
}
export interface ProcessNotionWebhookInput {
    source?: Record<string, any>;
    data?: ProcessNotionWebhookInputData;
    [key: string]: any;
}
export declare const createProcessNotionWebhookUseCase: (deps: {
    templateRepository: TemplateRepository;
    destinationRepository: DestinationRepository;
    notionApiService: NotionApiService;
    messageFormatterService: MessageFormatterService;
    notificationClient: NotificationClient;
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    encryptionService: EncryptionService;
}) => (input: ProcessNotionWebhookInput) => Promise<void>;
export {};
