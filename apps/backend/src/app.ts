import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { cors } from "hono/cors";
import { initializeFirestoreRepositories } from "./di";
import { createAuthMiddleware } from "./presentation/middleware/authMiddleware";
import { createDestinationRoutes } from "./presentation/routes/destinationRoutes";
import { createNotionDatabaseRoutes } from "./presentation/routes/notionDatabaseRoutes";
import { createTemplateRoutes } from "./presentation/routes/templateRoutes";
import { createUserNotionIntegrationRoutes } from "./presentation/routes/userNotionIntegrationRoutes";
import { createWebhookRoutes } from "./presentation/routes/webhookRoutes";

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
const firebaseAuth = getAuth(); // Firebase Authインスタンスを取得

const app = new OpenAPIHono<{ Variables: { userId: string } }>()
	.doc("/specification", {
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "NotiPal API",
		},
	})
	.use(
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
	)
	.route(
		"/destinations",
		createDestinationRoutes(useCases, createAuthMiddleware(firebaseAuth)),
	)
	.route(
		"/templates",
		createTemplateRoutes(useCases, createAuthMiddleware(firebaseAuth)),
	)
	.route(
		"/me/notion-integrations",
		createUserNotionIntegrationRoutes(
			useCases,
			createAuthMiddleware(firebaseAuth),
		),
	)
	.route(
		"/notion-databases",
		createNotionDatabaseRoutes(useCases, createAuthMiddleware(firebaseAuth)),
	)
	.route("/webhooks", createWebhookRoutes(useCases))
	.get("/", (c) => c.text("NotiPal App is running!"));

// --- OpenAPI Docs ---
// MEMO: createRouteを使ってなかったので一旦コメントアウト、修正後に戻す
// app.doc("/specification", {
// 	openapi: "3.0.0",
// 	info: {
// 		version: "1.0.0",
// 		title: "NotiPal API",
// 	},
// });
app.get("/doc", swaggerUI({ url: "/specification" }));

export { app };

export type AppType = typeof app;
