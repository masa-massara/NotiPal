// src/di/index.ts
import { getApps } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import type { CacheService } from "../application/services/cacheService";
import { MessageFormatterServiceImpl } from "../application/services/messageFormatterServiceImpl";
import { createCreateDestinationUseCase } from "../application/usecases/createDestinationUseCase";
import { createCreateTemplateUseCase } from "../application/usecases/createTemplateUseCase";
import { createUserNotionIntegrationUseCase } from "../application/usecases/createUserNotionIntegrationUseCase";
import { createDeleteDestinationUseCase } from "../application/usecases/deleteDestinationUseCase";
import { createDeleteTemplateUseCase } from "../application/usecases/deleteTemplateUseCase";
import { deleteUserNotionIntegrationUseCase } from "../application/usecases/deleteUserNotionIntegrationUseCase";
import { createGetDestinationUseCase } from "../application/usecases/getDestinationUseCase";
import { createGetNotionDatabasePropertiesUseCase } from "../application/usecases/getNotionDatabasePropertiesUseCase";
import { createGetTemplateUseCase } from "../application/usecases/getTemplateUseCase";
import { createListDestinationsUseCase } from "../application/usecases/listDestinationsUseCase";
import { createListNotionDatabasesUseCase } from "../application/usecases/listNotionDatabasesUseCase";
import { createListTemplatesUseCase } from "../application/usecases/listTemplatesUseCase";
import { listUserNotionIntegrationsUseCase } from "../application/usecases/listUserNotionIntegrationsUseCase";

import { createProcessNotionWebhookUseCase } from "../application/usecases/processNotionWebhookUseCase";

import type { EncryptionService } from "../application/services/encryptionService";
import { createUpdateDestinationUseCase } from "../application/usecases/updateDestinationUseCase";
import { createUpdateTemplateUseCase } from "../application/usecases/updateTemplateUseCase";
import type { DestinationRepository } from "../domain/repositories/destinationRepository";
import type { TemplateRepository } from "../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../domain/repositories/userNotionIntegrationRepository";
import type { MessageFormatterService } from "../domain/services/messageFormatterService";
import type { NotificationClient } from "../domain/services/notificationClient";
import type { NotionApiService } from "../domain/services/notionApiService";
import { createFirestoreDestinationRepository } from "../infrastructure/persistence/firestore/firestoreDestinationRepository";
import { createFirestoreTemplateRepository } from "../infrastructure/persistence/firestore/firestoreTemplateRepository";
import { createFirestoreUserNotionIntegrationRepository } from "../infrastructure/persistence/firestore/firestoreUserNotionIntegrationRepository";
import { InMemoryCacheService } from "../infrastructure/persistence/inMemory/inMemoryCacheService";
import { NodeCryptoEncryptionService } from "../infrastructure/services/nodeCryptoEncryptionService";
import { HttpNotificationClient } from "../infrastructure/web-clients/httpNotificationClient";
import { NotionApiClient } from "../infrastructure/web-clients/notionApiClient";

// --- Environment Variable Checks ---
const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
	const errorMessage =
		"FATAL ERROR: ENCRYPTION_KEY environment variable is not set (NotiPal).";
	console.error(errorMessage);
	throw new Error(errorMessage);
}

// --- DI Setup ---
export const cacheService: CacheService = new InMemoryCacheService();
export const notionApiService: NotionApiService = new NotionApiClient(
	cacheService,
);
export const encryptionService: EncryptionService =
	new NodeCryptoEncryptionService(encryptionKey);
export const messageFormatterService: MessageFormatterService =
	new MessageFormatterServiceImpl();
export const notificationClient: NotificationClient =
	new HttpNotificationClient();

export const initializeFirestoreRepositories = (
	firestoreInstance: Firestore,
) => {
	const templateRepository: TemplateRepository =
		createFirestoreTemplateRepository(firestoreInstance);
	const destinationRepository: DestinationRepository =
		createFirestoreDestinationRepository(firestoreInstance);
	const userNotionIntegrationRepository: UserNotionIntegrationRepository =
		createFirestoreUserNotionIntegrationRepository(firestoreInstance);

	// --- ユースケースのインスタンス化 ---
	const createTemplateUseCase = createCreateTemplateUseCase({
		templateRepository,
		userNotionIntegrationRepository,
		notionApiService,
		encryptionService,
	});
	const getTemplateUseCase = createGetTemplateUseCase({ templateRepository });
	const listTemplatesUseCase = createListTemplatesUseCase({
		templateRepository,
	});
	const updateTemplateUseCase = createUpdateTemplateUseCase({
		templateRepository,
		userNotionIntegrationRepository,
		notionApiService,
		encryptionService,
	});
	const deleteTemplateUseCase = createDeleteTemplateUseCase({
		templateRepository,
	});

	const createDestinationUseCase = createCreateDestinationUseCase({
		destinationRepository,
	});
	const deleteDestinationUseCase = createDeleteDestinationUseCase({
		destinationRepository,
	});
	const getDestinationUseCase = createGetDestinationUseCase({
		destinationRepository,
	});
	const listDestinationsUseCase = createListDestinationsUseCase({
		destinationRepository,
	});
	const updateDestinationUseCase = createUpdateDestinationUseCase({
		destinationRepository,
	});

	const createUserNotionIntegrationUseCaseFn =
		createUserNotionIntegrationUseCase({
			userNotionIntegrationRepository,
			encryptionService,
		});
	const listUserNotionIntegrationsUseCaseFn = listUserNotionIntegrationsUseCase(
		{
			userNotionIntegrationRepository,
		},
	);
	const deleteUserNotionIntegrationUseCaseFn =
		deleteUserNotionIntegrationUseCase({
			userNotionIntegrationRepository,
		});

	const listNotionDatabasesUseCase = createListNotionDatabasesUseCase({
		userNotionIntegrationRepository,
		encryptionService,
		notionApiService,
	});

	const getNotionDatabasePropertiesUseCase =
		createGetNotionDatabasePropertiesUseCase({
			userNotionIntegrationRepository,
			encryptionService,
			notionApiService,
			cacheService,
		});

	const processNotionWebhookUseCase = createProcessNotionWebhookUseCase({
		templateRepository,
		destinationRepository,
		notionApiService,
		messageFormatterService,
		notificationClient,
		userNotionIntegrationRepository,
		encryptionService,
	});

	return {
		createTemplateUseCase,
		getTemplateUseCase,
		listTemplatesUseCase,
		updateTemplateUseCase,
		deleteTemplateUseCase,
		createDestinationUseCase,
		deleteDestinationUseCase,
		getDestinationUseCase,
		listDestinationsUseCase,
		updateDestinationUseCase,
		createUserNotionIntegrationUseCaseFn,
		listUserNotionIntegrationsUseCaseFn,
		deleteUserNotionIntegrationUseCaseFn,
		listNotionDatabasesUseCase,
		getNotionDatabasePropertiesUseCase,
		processNotionWebhookUseCase,
	};
};

export type InitializedUseCases = ReturnType<
	typeof initializeFirestoreRepositories
>;
