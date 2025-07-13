import type { Firestore } from "firebase-admin/firestore";
import type { CacheService } from "../application/services/cacheService";
import type { EncryptionService } from "../application/services/encryptionService";
import type { MessageFormatterService } from "../domain/services/messageFormatterService";
import type { NotificationClient } from "../domain/services/notificationClient";
import type { NotionApiService } from "../domain/services/notionApiService";
export declare const cacheService: CacheService;
export declare const notionApiService: NotionApiService;
export declare const encryptionService: EncryptionService;
export declare const messageFormatterService: MessageFormatterService;
export declare const notificationClient: NotificationClient;
export declare const initializeFirestoreRepositories: (firestoreInstance: Firestore) => {
    createTemplateUseCase: (input: import("@notipal/common").CreateTemplateApiInput & {
        userId: string;
    }) => Promise<import("@notipal/common").Template>;
    getTemplateUseCase: (input: {
        id: string;
        userId: string;
    }) => Promise<import("@notipal/common").Template | null>;
    listTemplatesUseCase: (input: {
        userId: string;
    }) => Promise<import("@notipal/common").Template[]>;
    updateTemplateUseCase: (input: import("@notipal/common").UpdateTemplateApiInput & {
        id: string;
        userId: string;
    }) => Promise<import("@notipal/common").Template>;
    deleteTemplateUseCase: (input: {
        id: string;
        userId: string;
    }) => Promise<void>;
    createDestinationUseCase: (input: import("@notipal/common").CreateDestinationApiInput & {
        userId: string;
    }) => Promise<import("@notipal/common").Destination>;
    deleteDestinationUseCase: (input: import("../application/usecases/deleteDestinationUseCase").DeleteDestinationInput) => Promise<void>;
    getDestinationUseCase: (input: import("../application/usecases/getDestinationUseCase").GetDestinationInput) => Promise<import("../application/usecases/getDestinationUseCase").GetDestinationOutput>;
    listDestinationsUseCase: (input: import("../application/usecases/listDestinationsUseCase").ListDestinationsInput) => Promise<import("../application/usecases/listDestinationsUseCase").ListDestinationsOutput>;
    updateDestinationUseCase: (input: import("../application/usecases/updateDestinationUseCase").UpdateDestinationInput) => Promise<import("../application/usecases/updateDestinationUseCase").UpdateDestinationOutput>;
    createUserNotionIntegrationUseCaseFn: (input: {
        userId: string;
    } & import("@notipal/common").CreateUserNotionIntegrationApiInput) => Promise<Omit<import("@notipal/common").InternalUserNotionIntegration, "notionIntegrationToken">>;
    listUserNotionIntegrationsUseCaseFn: (input: {
        userId: string;
    }) => Promise<Omit<import("@notipal/common").InternalUserNotionIntegration, "notionIntegrationToken">[]>;
    deleteUserNotionIntegrationUseCaseFn: (input: {
        integrationId: string;
        userId: string;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
    listNotionDatabasesUseCase: (input: import("../application/dtos/notionDatabaseDTOs").ListNotionDatabasesInput) => Promise<import("../application/dtos/notionDatabaseDTOs").ListNotionDatabasesOutput>;
    getNotionDatabasePropertiesUseCase: (input: import("../application/dtos/notionDatabaseDTOs").GetNotionDatabasePropertiesInput) => Promise<import("../application/dtos/notionDatabaseDTOs").GetNotionDatabasePropertiesOutput>;
    processNotionWebhookUseCase: (input: import("../application/usecases/processNotionWebhookUseCase").ProcessNotionWebhookInput) => Promise<void>;
};
export type InitializedUseCases = ReturnType<typeof initializeFirestoreRepositories>;
