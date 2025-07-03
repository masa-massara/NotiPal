import {
	type CreateTemplateApiInput,
	ErrorCode,
	type Template,
	type UpdateTemplateApiInput,
} from "@notipal/common";
import type { Context, TypedResponse } from "hono";
import { HTTPException } from "hono/http-exception";

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
	async (c: CreateTemplateHandlerContext): Promise<TypedResponse<Template, 201, "json">> => {
		try {
			const userId = c.get("userId");
			const validatedBody = await c.req.json();

			const result = await createUseCase({ ...validatedBody, userId });
			return c.json(result, 201);
		} catch (error: unknown) {
			const err = error as { message?: string };
			throw new HTTPException(500, {
				message: err.message,
			});
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
	async (c: GetTemplateContext): Promise<TypedResponse<Template | null, 200 | 404, "json">> => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id) {
				throw new HTTPException(400, {
					message: "Template ID is required",
				});
			}
			const result = await getUseCase({ id, userId });
			if (!result) {
				throw new HTTPException(404, {
					message: "Template not found",
				});
			}
			return c.json(result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message: err.message,
			});
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
	async (c: ListTemplatesContext): Promise<TypedResponse<Template[], 200, "json">> => {
		try {
			const userId = c.get("userId");
			const result = await listUseCase({ userId });
			return c.json(result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			throw new HTTPException(500, {
				message: err.message,
			});
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
	async (c: UpdateTemplateHandlerContext): Promise<TypedResponse<Template, 200 | 404, "json">> => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id) {
				throw new HTTPException(400, {
					message: "Template ID is required",
				});
			}
			const validatedBody = await c.req.json();
			const result = await updateUseCase({ ...validatedBody, id, userId });
			return c.json(result);
		} catch (error: unknown) {
			const err = error as { message?: string };
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message: err.message,
			});
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
	async (c: DeleteTemplateContext): Promise<TypedResponse<null, 204 | 404, "body">> => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			if (!id) {
				throw new HTTPException(400, {
					message: "Template ID is required",
				});
			}
			await deleteUseCase({ id, userId });
			return c.body(null, 204);
		} catch (error: unknown) {
			const err = error as { message?: string };
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message: err.message,
			});
		}
	};
