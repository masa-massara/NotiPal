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
	tags: ["Templates"],
	description: "ユーザーのすべてのテンプレートリストを取得します。",
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
	tags: ["Templates"],
	description: "新しいテンプレートを作成します。",
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
	tags: ["Templates"],
	description: "IDで特定のテンプレートを取得します。",
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
	tags: ["Templates"],
	description: "IDで特定のテンプレートを更新します。",
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
	tags: ["Templates"],
	description: "IDで特定のテンプレートを削除します。",
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
