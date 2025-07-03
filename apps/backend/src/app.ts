import { OpenAPIHono } from "@hono/zod-openapi";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { cors } from "hono/cors";
import { initializeFirestoreRepositories } from "./di";
import { authMiddleware } from "./presentation/middleware/authMiddleware";
import { createDestinationRoutes } from "./presentation/routes/destinationRoutes";
import { createNotionDatabaseRoutes } from "./presentation/routes/notionDatabaseRoutes";
import { createTemplateRoutes } from "./presentation/routes/templateRoutes";
import { createUserNotionIntegrationRoutes } from "./presentation/routes/userNotionIntegrationRoutes";
import { createWebhookRoutes } from "./presentation/routes/webhookRoutes";
import { swaggerUI } from "@hono/swagger-ui";

declare module "hono" {
	interface ContextVariableMap {
		userId: string;
	}
}

// --- Firebase Admin SDK Initialization ---
if (!getApps().length) {
	let serviceAccountPath: string | undefined;

	if (process.env.NODE_ENV === "production") {
		serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_PROD;
	} else {
		serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_DEV;
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
			initializeApp({
				credential: cert(serviceAccountPath),
			});
		} else if (process.env.NODE_ENV === "production") {
			initializeApp();
		} else {
			throw new Error(
				"Firebase Admin SDK service account path configuration error for NotiPal.",
			);
		}
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
}

// Initialize Firestore repositories after Firebase app is initialized
const firestoreInstance = getFirestore();
const useCases = initializeFirestoreRepositories(firestoreInstance);

const app = new OpenAPIHono<{ Variables: { userId: string } }>();

app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"https://notipal-frontend-service-937400838385.asia-northeast1.run.app",
		],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// --- ルーティング定義 ---
const apiV1 = new OpenAPIHono<{ Variables: { userId: string } }>()
	// Middleware
	.use("/destinations*", authMiddleware)
	.use("/templates*", authMiddleware)
	.use("/me/notion-integrations*", authMiddleware)
	.use("/notion-databases*", authMiddleware)
	// Routes
	.route("/destinations", createDestinationRoutes(useCases))
	.route("/templates", createTemplateRoutes(useCases))
	.route("/me/notion-integrations", createUserNotionIntegrationRoutes(useCases))
	.route("/notion-databases", createNotionDatabaseRoutes(useCases));

app
	.route("/api/v1", apiV1)
	.route("/webhooks", createWebhookRoutes(useCases))
	// Root Endpoint
	.get("/", (c) => c.text("NotiPal App is running!"));

// --- OpenAPI Docs ---
app.get("/doc", swaggerUI({ url: "/specification" }));

export { app };

export type AppType = typeof apiV1;
