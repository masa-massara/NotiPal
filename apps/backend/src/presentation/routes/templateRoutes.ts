import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	createTemplateApiSchema,
	templateSchema,
	updateTemplateApiSchema,
} from "@notipal/common";
import { z } from "zod";
import type { InitializedUseCases } from "../../di";
import {
	createTemplateHandler,
	deleteTemplateHandler,
	getTemplateByIdHandler,
	listTemplatesHandler,
	updateTemplateHandler,
} from "../handlers/templateHandler";

// Route definitions
const listTemplatesRoute = createRoute({
	method: "get",
	path: "/",
	responses: {
		200: {
			description: "List of templates",
			content: {
				"application/json": {
					schema: z.array(templateSchema),
				},
			},
		},
	},
});

const createTemplateRoute = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: createTemplateApiSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Created template",
			content: {
				"application/json": {
					schema: templateSchema,
				},
			},
		},
	},
});

const getTemplateRoute = createRoute({
	method: "get",
	path: "/:id",
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		200: {
			description: "A template",
			content: {
				"application/json": {
					schema: templateSchema,
				},
			},
		},
	},
});

const updateTemplateRoute = createRoute({
	method: "put",
	path: "/:id",
	request: {
		params: z.object({ id: z.string() }),
		body: {
			content: {
				"application/json": {
					schema: updateTemplateApiSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Updated template",
			content: {
				"application/json": {
					schema: templateSchema,
				},
			},
		},
	},
});

const deleteTemplateRoute = createRoute({
	method: "delete",
	path: "/:id",
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		204: {
			description: "Template deleted",
		},
	},
});

export const createTemplateRoutes = (useCases: InitializedUseCases) => {
	const templateRoutes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.openapi(listTemplatesRoute, (c) => {
			const result = listTemplatesHandler(c, useCases);
			return result;
		})
		.openapi(createTemplateRoute, (c) => {
			const result = createTemplateHandler(c, useCases);
			return result;
		})
		.openapi(getTemplateRoute, (c) => {
			const result = getTemplateByIdHandler(c, useCases);
			return result;
		})
		.openapi(updateTemplateRoute, (c) => {
			const result = updateTemplateHandler(c, useCases);
			return result;
		})
		.openapi(deleteTemplateRoute, (c) => {
			const result = deleteTemplateHandler(c, useCases);
			return result;
		});

	return templateRoutes;
};
