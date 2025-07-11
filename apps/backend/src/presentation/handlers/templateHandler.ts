import type {
	CreateTemplateApiInput,
	Template,
	UpdateTemplateApiInput,
} from "@notipal/common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { InitializedUseCases } from "../../di";

export const createTemplateHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const body = await c.req.json<CreateTemplateApiInput>();
		const result = await useCases.createTemplateUseCase({ ...body, userId });
		return c.json(result, 201);
	} catch (error: unknown) {
		throw new HTTPException(500, { message: (error as Error).message });
	}
};

export const getTemplateByIdHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const result = await useCases.getTemplateUseCase({ id, userId });
		if (!result) {
			throw new HTTPException(404, { message: "Template not found" });
		}
		return c.json(result, 200);
	} catch (error: unknown) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: (error as Error).message });
	}
};

export const listTemplatesHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const result = await useCases.listTemplatesUseCase({ userId });
		return c.json({ success: true, data: result }, 200);
	} catch (error: unknown) {
		throw new HTTPException(500, { message: (error as Error).message });
	}
};

export const updateTemplateHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const body = await c.req.json<UpdateTemplateApiInput>();
		const result = await useCases.updateTemplateUseCase({
			...body,
			id,
			userId,
		});
		return c.json(result, 200);
	} catch (error: unknown) {
		if ((error as Error).message?.includes("not found")) {
			throw new HTTPException(404, { message: (error as Error).message });
		}
		throw new HTTPException(500, { message: (error as Error).message });
	}
};

export const deleteTemplateHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		await useCases.deleteTemplateUseCase({ id, userId });
		return c.body(null, 204);
	} catch (error: unknown) {
		if ((error as Error).message?.includes("not found")) {
			throw new HTTPException(404, { message: (error as Error).message });
		}
		throw new HTTPException(500, { message: (error as Error).message });
	}
};
