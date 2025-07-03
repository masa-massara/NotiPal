import { z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { userNotionIntegrationSchema } from "@notipal/common";
import type { InitializedUseCases } from "../../di";
import { createUserNotionIntegrationHandlers } from "../handlers/userNotionIntegrationHandler";

export const createUserNotionIntegrationRoutes = (
	useCases: InitializedUseCases,
) => {
	const userNotionIntegrationHandlers = createUserNotionIntegrationHandlers(
		useCases,
	);

	const userNotionIntegrationRoutes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.post(
			"/",
			userNotionIntegrationHandlers.createIntegrationHandler,
		)
		.get(
			"/",
			userNotionIntegrationHandlers.listIntegrationsHandler,
		)
		.delete(
			"/:integrationId",
			userNotionIntegrationHandlers.deleteIntegrationHandler,
		)
		.get(
			"/:integrationId/databases",
			userNotionIntegrationHandlers.listUserAccessibleDatabasesHandler,
		);

	return userNotionIntegrationRoutes;
};
