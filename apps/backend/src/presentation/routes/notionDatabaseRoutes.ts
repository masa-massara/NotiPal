import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
import { getNotionDatabasePropertiesHandlerFactory } from "../handlers/notionDatabaseHandler";

export const createNotionDatabaseRoutes = (useCases: InitializedUseCases) => {
	const notionDatabaseRoutes = new OpenAPIHono<{
		Variables: { userId: string };
	}>();

	notionDatabaseRoutes.get(
		"/:databaseId/properties",
		getNotionDatabasePropertiesHandlerFactory(
			useCases.getNotionDatabasePropertiesUseCase,
		),
	);

	return notionDatabaseRoutes;
};
