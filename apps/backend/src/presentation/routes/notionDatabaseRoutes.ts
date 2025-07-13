import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { notionPropertySchema } from "@notipal/common";
import { z } from "zod";
import type { InitializedUseCases } from "../../di";
import { getNotionDatabasePropertiesHandler } from "../handlers/notionDatabaseHandler";

const getPropertiesRoute = createRoute({
	method: "get",
	path: "/:databaseId/properties",
	tags: ["Notion Databases"],
	description: "特定のNotionデータベースのプロパティリストを取得します。",
	request: {
		params: z.object({ databaseId: z.string() }),
		query: z.object({ integrationId: z.string() }),
	},
	responses: {
		200: {
			description: "List of Notion database properties",
			content: {
				"application/json": {
					schema: z.array(notionPropertySchema),
				},
			},
		},
	},
});

import type { MiddlewareHandler } from "hono";

export const createNotionDatabaseRoutes = (
	useCases: InitializedUseCases,
	authMiddleware: MiddlewareHandler,
) => {
	const routes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.use("*", authMiddleware)
		.openapi(getPropertiesRoute, (c) => {
			const result = getNotionDatabasePropertiesHandler(c, useCases);
			return result;
		});

	return routes;
};
