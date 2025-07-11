import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	createDestinationApiSchema,
	destinationSchema,
	updateDestinationApiSchema,
} from "@notipal/common";
import { z } from "zod";
import type { InitializedUseCases } from "../../di";
import {
	createDestinationHandler,
	deleteDestinationHandler,
	getDestinationByIdHandler,
	listDestinationsHandler,
	updateDestinationHandler,
} from "../handlers/destinationHandler";

// Route definitions
const listDestinationsRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Destinations"],
	description: "ユーザーのすべての宛先リストを取得します。",
	responses: {
		200: {
			description: "List of destinations",
			content: {
				"application/json": {
					schema: z.array(destinationSchema),
				},
			},
		},
	},
});

const createDestinationRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Destinations"],
	description: "新しい宛先を作成します。",
	request: {
		body: {
			content: {
				"application/json": {
					schema: createDestinationApiSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Created destination",
			content: {
				"application/json": {
					schema: destinationSchema,
				},
			},
		},
	},
});

const getDestinationRoute = createRoute({
	method: "get",
	path: "/:id",
	tags: ["Destinations"],
	description: "IDで特定の宛先を取得します。",
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		200: {
			description: "A destination",
			content: {
				"application/json": {
					schema: destinationSchema,
				},
			},
		},
	},
});

const updateDestinationRoute = createRoute({
	method: "put",
	path: "/:id",
	tags: ["Destinations"],
	description: "IDで特定の宛先を更新します。",
	request: {
		params: z.object({ id: z.string() }),
		body: {
			content: {
				"application/json": {
					schema: updateDestinationApiSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Updated destination",
			content: {
				"application/json": {
					schema: destinationSchema,
				},
			},
		},
	},
});

const deleteDestinationRoute = createRoute({
	method: "delete",
	path: "/:id",
	tags: ["Destinations"],
	description: "IDで特定の宛先を削除します。",
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		204: {
			description: "Destination deleted",
		},
	},
});

import type { MiddlewareHandler } from "hono";

export const createDestinationRoutes = (
	useCases: InitializedUseCases,
	authMiddleware: MiddlewareHandler,
) => {
	const destinationRoutes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.use("*", authMiddleware)
		.openapi(listDestinationsRoute, (c) => {
			const result = listDestinationsHandler(c, useCases);
			return result;
		})
		.openapi(createDestinationRoute, (c) => {
			const result = createDestinationHandler(c, useCases);
			return result;
		})
		.openapi(getDestinationRoute, (c) => {
			const result = getDestinationByIdHandler(c, useCases);
			getDestinationByIdHandler(c, useCases);
			return result;
		})
		.openapi(updateDestinationRoute, (c) => {
			const result = updateDestinationHandler(c, useCases);
			return result;
		})
		.openapi(deleteDestinationRoute, (c) => {
			const result = deleteDestinationHandler(c, useCases);
			return result;
		});

	return destinationRoutes;
};
