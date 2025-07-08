import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	createUserNotionIntegrationApiSchema,
	notionDatabaseSchema,
	userNotionIntegrationSchema,
} from "@notipal/common";
import { z } from "zod";
import type { InitializedUseCases } from "../../di";
import {
	createIntegrationHandler,
	deleteIntegrationHandler,
	listIntegrationsHandler,
	listUserAccessibleDatabasesHandler,
} from "../handlers/userNotionIntegrationHandler";

// Route definitions
const createIntegrationRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["User Notion Integrations"],
	description: "ユーザーの新しいNotionインテグレーションを作成します。",
	request: {
		body: {
			content: {
				"application/json": {
					schema: createUserNotionIntegrationApiSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Created Notion integration",
			content: {
				"application/json": {
					schema: userNotionIntegrationSchema,
				},
			},
		},
	},
});

const listIntegrationsRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["User Notion Integrations"],
	description:
		"ユーザーのすべてのNotionインテグレーションのリストを取得します。",
	responses: {
		200: {
			description: "List of Notion integrations",
			content: {
				"application/json": {
					schema: z.array(userNotionIntegrationSchema),
				},
			},
		},
	},
});

const deleteIntegrationRoute = createRoute({
	method: "delete",
	path: "/:integrationId",
	tags: ["User Notion Integrations"],
	description: "IDで特定のNotionインテグレーションを削除します。",
	request: {
		params: z.object({ integrationId: z.string() }),
	},
	responses: {
		204: {
			description: "Notion integration deleted",
		},
	},
});

const listDatabasesRoute = createRoute({
	method: "get",
	path: "/:integrationId/databases",
	tags: ["User Notion Integrations"],
	description:
		"特定のインテグレーションがアクセスできるNotionデータベースのリストを取得します。",
	request: {
		params: z.object({ integrationId: z.string() }),
	},
	responses: {
		200: {
			description: "List of accessible Notion databases",
			content: {
				"application/json": {
					schema: z.array(notionDatabaseSchema),
				},
			},
		},
		500: {
			description: "Internal server error",
			content: {
				"application/json": {
					schema: z.object({ error: z.string(), details: z.string() }),
				},
			},
		},
	},
});

export const createUserNotionIntegrationRoutes = (
	useCases: InitializedUseCases,
) => {
	const routes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.openapi(createIntegrationRoute, (c) => {
			const result = createIntegrationHandler(c, useCases);
			return result;
		})
		.openapi(listIntegrationsRoute, (c) => {
			const result = listIntegrationsHandler(c, useCases);
			return result;
		})
		.openapi(deleteIntegrationRoute, (c) => {
			const result = deleteIntegrationHandler(c, useCases);
			return result;
		})
		.openapi(listDatabasesRoute, (c) => {
			const result = listUserAccessibleDatabasesHandler(c, useCases);
			return result;
		});

	return routes;
};
