import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
import {
	createTemplateHandler,
	deleteTemplateHandler,
	getTemplateByIdHandler,
	listTemplatesHandler,
	updateTemplateHandler,
} from "../handlers/templateHandler";

export const createTemplateRoutes = (useCases: InitializedUseCases) => {
	const templateRoutes = new OpenAPIHono<{ Variables: { userId: string } }>()
		.get("/", listTemplatesHandler(useCases.listTemplatesUseCase))
		.post("/", createTemplateHandler(useCases.createTemplateUseCase))
		.get("/:id", getTemplateByIdHandler(useCases.getTemplateUseCase))
		.put("/:id", updateTemplateHandler(useCases.updateTemplateUseCase))
		.delete("/:id", deleteTemplateHandler(useCases.deleteTemplateUseCase));

	return templateRoutes;
};
