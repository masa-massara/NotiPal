// src/main.ts
import { Hono } from "hono";

// Firebase Admin SDK関連のimport
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import type { CacheService } from "./application/services/cacheService";
import type { EncryptionService } from "./application/services/encryptionService";
import type { DestinationRepository } from "./domain/repositories/destinationRepository";
// --- Domain層のインポート ---
import type { TemplateRepository } from "./domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "./domain/repositories/userNotionIntegrationRepository";
import type { MessageFormatterService } from "./domain/services/messageFormatterService";
import type { NotificationClient } from "./domain/services/notificationClient";
import type { NotionApiService } from "./domain/services/notionApiService";

// --- Application層 (UseCases & Services) のインポート ---
import { CreateTemplateUseCase } from "./application/usecases/createTemplateUseCase";
import { DeleteTemplateUseCase } from "./application/usecases/deleteTemplateUseCase";
import { GetTemplateUseCase } from "./application/usecases/getTemplateUseCase";
import { ListTemplatesUseCase } from "./application/usecases/listTemplatesUseCase";
import { UpdateTemplateUseCase } from "./application/usecases/updateTemplateUseCase";

import { CreateDestinationUseCase } from "./application/usecases/createDestinationUseCase";
import { DeleteDestinationUseCase } from "./application/usecases/deleteDestinationUseCase";
import { GetDestinationUseCase } from "./application/usecases/getDestinationUseCase";
import { ListDestinationsUseCase } from "./application/usecases/listDestinationsUseCase";
import { UpdateDestinationUseCase } from "./application/usecases/updateDestinationUseCase";

import { CreateUserNotionIntegrationUseCase } from "./application/usecases/createUserNotionIntegrationUseCase";
import { DeleteUserNotionIntegrationUseCase } from "./application/usecases/deleteUserNotionIntegrationUseCase";
import { GetNotionDatabasePropertiesUseCase } from "./application/usecases/getNotionDatabasePropertiesUseCase";
import { ListNotionDatabasesUseCase } from "./application/usecases/listNotionDatabasesUseCase";
import { ListUserNotionIntegrationsUseCase } from "./application/usecases/listUserNotionIntegrationsUseCase";

import { MessageFormatterServiceImpl } from "./application/services/messageFormatterServiceImpl";
import { ProcessNotionWebhookUseCase } from "./application/usecases/processNotionWebhookUseCase";

import { FirestoreDestinationRepository } from "./infrastructure/persistence/firestore/firestoreDestinationRepository";
// --- Infrastructure層 (具体的な実装) のインポート ---
import { FirestoreTemplateRepository } from "./infrastructure/persistence/firestore/firestoreTemplateRepository";
import { FirestoreUserNotionIntegrationRepository } from "./infrastructure/persistence/firestore/firestoreUserNotionIntegrationRepository";
import { InMemoryCacheService } from "./infrastructure/persistence/inMemory/inMemoryCacheService";
import { NodeCryptoEncryptionService } from "./infrastructure/services/nodeCryptoEncryptionService";
import { HttpNotificationClient } from "./infrastructure/web-clients/httpNotificationClient";
import { NotionApiClient } from "./infrastructure/web-clients/notionApiClient";

import {
	createDestinationHandlerFactory,
	deleteDestinationHandlerFactory,
	getDestinationByIdHandlerFactory,
	listDestinationsHandlerFactory,
	updateDestinationHandlerFactory,
} from "./presentation/handlers/destinationHandler";
import { getNotionDatabasePropertiesHandlerFactory } from "./presentation/handlers/notionDatabaseHandler";
import { notionWebhookHandlerFactory } from "./presentation/handlers/notionWebhookHandler";
// --- Presentation層 (Handlers) のインポート ---
import {
	createTemplateHandlerFactory,
	deleteTemplateHandlerFactory,
	getTemplateByIdHandlerFactory,
	listTemplatesHandlerFactory,
	updateTemplateHandlerFactory,
} from "./presentation/handlers/templateHandler";
import { createUserNotionIntegrationHandlers } from "./presentation/handlers/userNotionIntegrationHandler";

import { authMiddleware } from "./presentation/middleware/authMiddleware";

import "hono";
import { cors } from "hono/cors";

declare module "hono" {
	interface ContextVariableMap {
		userId: string;
	}
}

const app = new Hono<{ Variables: { userId: string } }>();

app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000", // フロントエンド開発サーバー
			"http://localhost:3001", // フロントエンド開発サーバー(別ポートの場合)
			"https://notipal-frontend-service-937400838385.asia-northeast1.run.app"
		],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// --- Firebase Admin SDK Initialization ---
if (!getApps().length) {
	let serviceAccountPath: string | undefined;
	let projectIdMessage: string;

	if (process.env.NODE_ENV === "production") {
		console.log(
			"Initializing Firebase Admin SDK for PRODUCTION environment (NotiPal).",
		);
		serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_PROD;
		projectIdMessage = "Production NotiPal Firebase Project";
		if (!serviceAccountPath) {
			console.log(
				"PRODUCTION (NotiPal): GOOGLE_APPLICATION_CREDENTIALS_PROD not set. Attempting to use default credentials (e.g., Cloud Run service account).",
			);
		}
	} else {
		// development またはその他の未指定の場合 (デフォルト開発)
		console.log(
			"Initializing Firebase Admin SDK for DEVELOPMENT environment (NotiPal).",
		);
		serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_DEV;
		projectIdMessage = "Development NotiPal Firebase Project";
		if (!serviceAccountPath) {
			console.error(
				"DEVELOPMENT (NotiPal): GOOGLE_APPLICATION_CREDENTIALS_DEV is not set in .env file. Firebase Admin SDK cannot be initialized with a specific service account for development.",
			);
			throw new Error(
				"Missing GOOGLE_APPLICATION_CREDENTIALS_DEV for development environment.",
			);
		}
	}

	try {
		if (serviceAccountPath) {
			console.log(
				`Initializing Firebase Admin SDK with service account from: ${serviceAccountPath} for ${projectIdMessage}.`,
			);
			initializeApp({
				credential: cert(serviceAccountPath),
			});
		} else if (process.env.NODE_ENV === "production") {
			console.log(
				"Initializing Firebase Admin SDK with default credentials for PRODUCTION (NotiPal) (e.g., Application Default Credentials on Cloud Run).",
			);
			initializeApp();
		} else {
			// 開発環境でサービスアカウントパスがない場合は上でエラーにしているので、ここは通常通らない
			throw new Error(
				"Firebase Admin SDK service account path configuration error for NotiPal.",
			);
		}
		console.log(
			"Firebase Admin SDK initialized centrally in main.ts (NotiPal).",
		);
	} catch (e: unknown) {
		const errorMessageText = e instanceof Error ? e.message : String(e);
		console.error(
			"Failed to initialize Firebase Admin SDK (NotiPal):",
			errorMessageText,
		);
		throw new Error(
			`Firebase Admin SDK initialization failed (NotiPal): ${errorMessageText}`,
		);
	}
} else {
	console.log("Firebase Admin SDK already initialized (NotiPal).");
}

// --- Environment Variable Checks ---
const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
	const errorMessage =
		"FATAL ERROR: ENCRYPTION_KEY environment variable is not set (NotiPal).";
	console.error(errorMessage);
	throw new Error(errorMessage);
}

// --- DI Setup ---
// ★ 修正箇所：リポジトリの初期化を try-catch で囲み、Firebase Admin SDKの初期化状態を確認
let templateRepository: TemplateRepository;
let destinationRepository: DestinationRepository;
let userNotionIntegrationRepository: UserNotionIntegrationRepository;

const cacheService: CacheService = new InMemoryCacheService();
const notionApiService: NotionApiService = new NotionApiClient(cacheService);
const encryptionService: EncryptionService = new NodeCryptoEncryptionService(
	encryptionKey,
);
const messageFormatterService: MessageFormatterService =
	new MessageFormatterServiceImpl();
const notificationClient: NotificationClient = new HttpNotificationClient();

let persistenceTypeMessage: string;

try {
	if (getApps().length === 0) {
		// この状態は、Admin SDKの初期化ブロックを通らなかった場合に発生しうる
		// 通常の起動フローでは上の初期化ブロックで初期化されるかエラーで停止するはず
		throw new Error(
			"Firebase Admin SDK is not initialized. Cannot create Firestore repositories for NotiPal.",
		);
	}
	const firestoreInstance = getFirestore(); // SDK初期化後に呼び出す
	templateRepository = new FirestoreTemplateRepository(); // FirestoreRepositoryは内部でgetFirestore()を呼ぶので、SDK初期化後ならOK
	destinationRepository = new FirestoreDestinationRepository();
	userNotionIntegrationRepository =
		new FirestoreUserNotionIntegrationRepository(firestoreInstance); // 明示的にインスタンスを渡す
	persistenceTypeMessage = "Persistence: Firestore (NotiPal)";
	console.log("Firestore repositories initialized successfully for NotiPal.");
} catch (error) {
	console.error(
		"Failed to initialize Firestore repositories for NotiPal:",
		error,
	);
	// 起動を継続できないのでエラーをスロー
	throw new Error(
		`Failed to initialize Firestore repositories for NotiPal: ${error instanceof Error ? error.message : String(error)}`,
	);
}

// --- ユースケースのインスタンス化 ---
const createTemplateUseCase = new CreateTemplateUseCase(
	templateRepository,
	userNotionIntegrationRepository,
	notionApiService,
	encryptionService,
);
const getTemplateUseCase = new GetTemplateUseCase(templateRepository);
const listTemplatesUseCase = new ListTemplatesUseCase(templateRepository);
const updateTemplateUseCase = new UpdateTemplateUseCase(
	templateRepository,
	userNotionIntegrationRepository,
	notionApiService,
	encryptionService,
);
const deleteTemplateUseCase = new DeleteTemplateUseCase(templateRepository);

const createDestinationUseCase = new CreateDestinationUseCase(
	destinationRepository,
);
const getDestinationUseCase = new GetDestinationUseCase(destinationRepository);
const listDestinationsUseCase = new ListDestinationsUseCase(
	destinationRepository,
);
const updateDestinationUseCase = new UpdateDestinationUseCase(
	destinationRepository,
);
const deleteDestinationUseCase = new DeleteDestinationUseCase(
	destinationRepository,
);

const createUserNotionIntegrationUseCase =
	new CreateUserNotionIntegrationUseCase(
		userNotionIntegrationRepository,
		encryptionService,
	);
const listUserNotionIntegrationsUseCase = new ListUserNotionIntegrationsUseCase(
	userNotionIntegrationRepository,
);
const deleteUserNotionIntegrationUseCase =
	new DeleteUserNotionIntegrationUseCase(userNotionIntegrationRepository);

const listNotionDatabasesUseCase = new ListNotionDatabasesUseCase(
	userNotionIntegrationRepository,
	encryptionService,
	notionApiService,
);

const getNotionDatabasePropertiesUseCase =
	new GetNotionDatabasePropertiesUseCase(
		userNotionIntegrationRepository,
		encryptionService,
		notionApiService,
		cacheService,
	);

const processNotionWebhookUseCase = new ProcessNotionWebhookUseCase(
	templateRepository,
	destinationRepository,
	notionApiService,
	messageFormatterService,
	notificationClient,
	userNotionIntegrationRepository,
	encryptionService,
);

// --- ルーティング定義 ---
const apiV1 = new Hono<{ Variables: { userId: string } }>();
apiV1.use("*", authMiddleware);

// Template API
apiV1.post("/templates", createTemplateHandlerFactory(createTemplateUseCase));
apiV1.get("/templates/:id", getTemplateByIdHandlerFactory(getTemplateUseCase));
apiV1.get("/templates", listTemplatesHandlerFactory(listTemplatesUseCase));
apiV1.put(
	"/templates/:id",
	updateTemplateHandlerFactory(updateTemplateUseCase),
);
apiV1.delete(
	"/templates/:id",
	deleteTemplateHandlerFactory(deleteTemplateUseCase),
);

// Destination API
apiV1.post(
	"/destinations",
	createDestinationHandlerFactory(createDestinationUseCase),
);
apiV1.get(
	"/destinations/:id",
	getDestinationByIdHandlerFactory(getDestinationUseCase),
);
apiV1.get(
	"/destinations",
	listDestinationsHandlerFactory(listDestinationsUseCase),
);
apiV1.put(
	"/destinations/:id",
	updateDestinationHandlerFactory(updateDestinationUseCase),
);
apiV1.delete(
	"/destinations/:id",
	deleteDestinationHandlerFactory(deleteDestinationUseCase),
);

// User Notion Integration API
const userNotionIntegrationHandlers = createUserNotionIntegrationHandlers(
	createUserNotionIntegrationUseCase,
	listUserNotionIntegrationsUseCase,
	deleteUserNotionIntegrationUseCase,
	listNotionDatabasesUseCase,
);

const userNotionIntegrationApi = new Hono<{ Variables: { userId: string } }>();
userNotionIntegrationApi.post(
	"/",
	userNotionIntegrationHandlers.createIntegrationHandler,
);
userNotionIntegrationApi.get(
	"/",
	userNotionIntegrationHandlers.listIntegrationsHandler,
);
userNotionIntegrationApi.delete(
	"/:integrationId",
	userNotionIntegrationHandlers.deleteIntegrationHandler,
);
userNotionIntegrationApi.get(
	"/:integrationId/databases",
	userNotionIntegrationHandlers.listUserAccessibleDatabasesHandler,
);
apiV1.route("/me/notion-integrations", userNotionIntegrationApi);

// Notion Database Properties API
const getNotionDatabasePropertiesHandler =
	getNotionDatabasePropertiesHandlerFactory(getNotionDatabasePropertiesUseCase);
apiV1.get(
	"/notion-databases/:databaseId/properties",
	getNotionDatabasePropertiesHandler,
);

app.route("/api/v1", apiV1);

// Webhook Endpoint
app.post(
	"/webhooks/notion",
	notionWebhookHandlerFactory(processNotionWebhookUseCase),
);

// Root Endpoint
app.get("/", (c) => c.text("NotiPal App is running!"));

export default {
	port: process.env.PORT || 8080,
	fetch: app.fetch,
};

console.log(`NotiPal app is running on port ${process.env.PORT || 8080}`);
if (process.env.NODE_ENV !== "production" && persistenceTypeMessage) {
	console.log(persistenceTypeMessage);
}
