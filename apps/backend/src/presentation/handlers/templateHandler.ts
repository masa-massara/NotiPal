import { ErrorCode, type Template } from "@notipal/common";
// src/presentation/handlers/templateHandler.ts
import type { Context } from "hono";
import { respondError, respondSuccess } from "../utils/apiResponder";

export const createTemplateHandler =
	(createUseCase: (input: Template) => Promise<Template>) =>
	async (c: Context) => {
		try {
			const userId = c.get("userId");
			const body = await c.req.json<Template>();
			const result = await createUseCase({ ...body, userId });
			return respondSuccess(c, result, "Template created successfully.", 201);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(c, ErrorCode.INTERNAL_SERVER_ERROR, err.message);
		}
	};

export const getTemplateByIdHandler =
	(
		getUseCase: (input: {
			id: string;
			userId: string;
		}) => Promise<Template | null>,
	) =>
	async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id)
				return respondError(
					c,
					ErrorCode.VALIDATION_ERROR,
					undefined,
					"Template ID is required",
				);
			// @ts-ignore
			const result = await getUseCase({ id, userId });
			if (!result)
				return respondError(
					c,
					ErrorCode.NOT_FOUND,
					undefined,
					"Template not found",
				);
			return respondSuccess(c, result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(c, ErrorCode.INTERNAL_SERVER_ERROR, err.message);
		}
	};

export const listTemplatesHandler =
	(listUseCase: (input: { userId: string }) => Promise<Template[]>) =>
	async (c: Context) => {
		try {
			const userId = c.get("userId");
			// @ts-ignore
			const result = await listUseCase({ userId });
			return respondSuccess(c, result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(c, ErrorCode.INTERNAL_SERVER_ERROR, err.message);
		}
	};

export const updateTemplateHandler =
	(
		updateUseCase: (
			input: Template & { id: string; userId: string },
		) => Promise<Template>,
	) =>
	async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id)
				return respondError(
					c,
					ErrorCode.VALIDATION_ERROR,
					undefined,
					"Template ID is required",
				);
			const body = await c.req.json<Template>();
			// @ts-ignore
			const result = await updateUseCase({ ...body, id, userId });
			return respondSuccess(c, result, "Template updated successfully.");
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(c, ErrorCode.INTERNAL_SERVER_ERROR, err.message);
		}
	};

export const deleteTemplateHandler =
	(deleteUseCase: (input: { id: string; userId: string }) => Promise<void>) =>
	async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id)
				return respondError(
					c,
					ErrorCode.VALIDATION_ERROR,
					undefined,
					"Template ID is required",
				);
			// @ts-ignore
			await deleteUseCase({ id, userId });
			return respondSuccess(c, null, "Template deleted successfully.", 204);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(c, ErrorCode.INTERNAL_SERVER_ERROR, err.message);
		}
	};
