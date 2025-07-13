import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import type { InitializedUseCases } from "../../di";
import { notionWebhookHandler } from "../handlers/notionWebhookHandler";

const notionWebhookRoute = createRoute({
	method: "post",
	path: "/notion",
	tags: ["Webhooks"],
	description: "Notionからの受信Webhookを処理します。",
	request: {
		body: {
			content: { "application/json": { schema: z.unknown() } },
		},
	},
	responses: {
		200: {
			description: "Webhook processed successfully",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
		500: {
			description: "Internal server error",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
						details: z.string(),
					}),
				},
			},
		},
	},
});

export const createWebhookRoutes = (useCases: InitializedUseCases) => {
	const webhookRoutes = new OpenAPIHono().openapi(notionWebhookRoute, (c) => {
		const result = notionWebhookHandler(c, useCases);
		return result;
	});

	return webhookRoutes;
};
