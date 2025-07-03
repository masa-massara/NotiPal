import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
import { notionWebhookHandlerFactory } from "../handlers/notionWebhookHandler";

export const createWebhookRoutes = (useCases: InitializedUseCases) => {
	const webhookRoutes = new OpenAPIHono()
		.post(
			"/notion",
			notionWebhookHandlerFactory(useCases.processNotionWebhookUseCase),
		);

	return webhookRoutes;
};
