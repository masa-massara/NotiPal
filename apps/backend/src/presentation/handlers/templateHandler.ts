import {
	type CreateTemplateApiInput,
	ErrorCode,
	type Template,
	type UpdateTemplateApiInput,
	createTemplateApiSchema,
	updateTemplateApiSchema,
} from "@notipal/common";
// src/presentation/handlers/templateHandler.ts
import type { Context, TypedResponse } from "hono";
import { respondError, respondSuccess } from "../utils/apiResponder";

// --- createTemplateHandler用の型定義 ---
type CreateTemplateUseCaseFn = (
	input: CreateTemplateApiInput & { userId: string },
) => Promise<Template>;
type CreateTemplateHandlerContext = Context<{
	Variables: { userId: string };
	in: { json: CreateTemplateApiInput };
}>;
export const createTemplateHandler =
	(createUseCase: CreateTemplateUseCaseFn) =>
	async (c: CreateTemplateHandlerContext): Promise<TypedResponse> => {
		try {
			const userId = c.get("userId");
			const validatedBody = await c.req.json();

			const result = await createUseCase({ ...validatedBody, userId });
			return respondSuccess(c, result, "Template created successfully.", 201);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				undefined,
				err.message,
			);
		}
	};

// --- getTemplateByIdHandler用の型定義 ---
type GetTemplateContext = Context<{
	Variables: { userId: string };
}>;
type GetTemplateUseCaseFn = (input: {
	id: string;
	userId: string;
}) => Promise<Template | null>;
export const getTemplateByIdHandler =
	(getUseCase: GetTemplateUseCaseFn) =>
	async (c: GetTemplateContext): Promise<TypedResponse> => {
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
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				undefined,
				err.message,
			);
		}
	};

// --- listTemplatesHandler用の型定義 ---
type ListTemplatesContext = Context<{
	Variables: { userId: string };
}>;
type ListTemplatesUseCaseFn = (input: { userId: string }) => Promise<
	Template[]
>;
export const listTemplatesHandler =
	(listUseCase: ListTemplatesUseCaseFn) =>
	async (c: ListTemplatesContext): Promise<TypedResponse> => {
		try {
			const userId = c.get("userId");
			const result = await listUseCase({ userId });
			return respondSuccess(c, result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				undefined,
				err.message,
			);
		}
	};

// --- updateTemplateHandler用の型定義 ---
type UpdateTemplateUseCaseFn = (
	input: UpdateTemplateApiInput & { id: string; userId: string },
) => Promise<Template>;
type UpdateTemplateHandlerContext = Context<{
	Variables: { userId: string };
	in: { json: UpdateTemplateApiInput };
}>;
export const updateTemplateHandler =
	(updateUseCase: UpdateTemplateUseCaseFn) =>
	async (c: UpdateTemplateHandlerContext): Promise<TypedResponse> => {
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
			const validatedBody = c.req.json();
			const result = await updateUseCase({ ...validatedBody, id, userId });
			return respondSuccess(c, result, "Template updated successfully.");
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				undefined,
				err.message,
			);
		}
	};

// --- deleteTemplateHandler用の型定義 ---
type DeleteTemplateContext = Context<{
	Variables: { userId: string };
}>;
type DeleteTemplateUseCaseFn = (input: {
	id: string;
	userId: string;
}) => Promise<void>;
export const deleteTemplateHandler =
	(deleteUseCase: DeleteTemplateUseCaseFn) =>
	async (c: DeleteTemplateContext): Promise<TypedResponse> => {
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
			await deleteUseCase({ id, userId });
			return respondSuccess(c, null, "Template deleted successfully.", 204);
		} catch (error: unknown) {
			const err = error as { message?: string };
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				undefined,
				err.message,
			);
		}
	};
