// src/presentation/handlers/userNotionIntegrationHandler.ts

import { createUserNotionIntegrationApiSchema } from "@notipal/common";
import type { InternalUserNotionIntegration } from "@notipal/common";
import { ErrorCode } from "@notipal/common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type {
	ListNotionDatabasesInput,
	ListNotionDatabasesOutput,
} from "../../application/dtos/notionDatabaseDTOs";
import type { EncryptionService } from "../../application/services/encryptionService";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import { respondError, respondSuccess } from "../utils/apiResponder";

// Factory function for the new handler
type ListNotionDatabasesUseCase = (
	input: ListNotionDatabasesInput,
) => Promise<ListNotionDatabasesOutput>;
function listUserAccessibleDatabasesHandlerFactory(
	useCase: ListNotionDatabasesUseCase,
) {
	return async (c: Context) => {
		// ログ 1: ハンドラ呼び出し確認
		console.log(
			"【BE Log 1 at Handler】listUserAccessibleDatabasesHandler - Entry",
		);
		try {
			const integrationId = c.req.param("integrationId");
			const userId = c.var.userId;

			// ログ 2: パラメータとuserIdの確認
			console.log(
				`【BE Log 2 at Handler】Integration ID: ${integrationId}, User ID: ${userId}`,
			);

			if (typeof userId !== "string") {
				console.error(
					"【BE Log 2.1 at Handler】CRITICAL: userId not found in context or is not a string after authMiddleware.",
				);
				throw new HTTPException(401, {
					message: "Unauthorized: User ID not found or invalid.",
				});
			}
			if (!integrationId) {
				console.error(
					"【BE Log 2.2 at Handler】integrationId path parameter is required.",
				);
				throw new HTTPException(400, {
					message: "integrationId path parameter is required",
				});
			}

			const input: ListNotionDatabasesInput = {
				integrationId,
				userId,
			};

			// ログ 3: ユースケース呼び出し直前
			console.log(
				"【BE Log 3 at Handler】Calling ListNotionDatabasesUseCase with input:",
				JSON.stringify(input, null, 2),
			);
			const output: ListNotionDatabasesOutput = await useCase(input);
			// ログ 4: ユースケースからの戻り値
			console.log(
				"【BE Log 4 at Handler】ListNotionDatabasesUseCase returned output:",
				JSON.stringify(output, null, 2),
			);

			return c.json(output, 200);
		} catch (error: unknown) {
			// ログ 5: エラー発生時
			if (error instanceof HTTPException) {
				throw error;
			}
			const message = error instanceof Error ? error.message : String(error);
			console.error(
				"【BE Log 5 at Handler】Error in listUserAccessibleDatabasesHandler:",
				message,
			);
			throw new HTTPException(500, {
				message: "Failed to list accessible Notion databases",
				cause: message,
			});
		}
	};
}

export function createUserNotionIntegrationHandlers(
	createUseCase: ReturnType<
		typeof import(
			"../../application/usecases/createUserNotionIntegrationUseCase",
		)["createUserNotionIntegrationUseCase"]
	>,
	listUseCase: ReturnType<
		typeof import(
			"../../application/usecases/listUserNotionIntegrationsUseCase",
		)["listUserNotionIntegrationsUseCase"]
	>,
	deleteUseCase: ReturnType<
		typeof import(
			"../../application/usecases/deleteUserNotionIntegrationUseCase",
		)["deleteUserNotionIntegrationUseCase"]
	>,
	listDatabasesUseCase: ListNotionDatabasesUseCase,
) {
	// Create
	const createIntegrationHandler = async (c: Context) => {
		try {
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				return respondError(
					c,
					ErrorCode.UNAUTHENTICATED,
					undefined,
					"User ID not found or invalid.",
				);
			}
			const body = await c.req.json();
			const parseResult = createUserNotionIntegrationApiSchema.safeParse(body);
			if (!parseResult.success) {
				return respondError(
					c,
					ErrorCode.VALIDATION_ERROR,
					parseResult.error.format(),
					"バリデーションエラー",
				);
			}
			const input = { userId, ...parseResult.data };
			// @ts-ignore
			const output = await createUseCase(input);
			return respondSuccess(c, output, "Notion連携を作成しました", 201);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				message,
				"Notion連携の作成に失敗しました",
			);
		}
	};

	// List
	const listIntegrationsHandler = async (c: Context) => {
		try {
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				return respondError(
					c,
					ErrorCode.UNAUTHENTICATED,
					undefined,
					"User ID not found or invalid.",
				);
			}
			// @ts-ignore
			const output = await listUseCase({ userId });
			return respondSuccess(c, output, "Notion連携一覧取得");
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				message,
				"Notion連携一覧の取得に失敗しました",
			);
		}
	};

	// Delete
	const deleteIntegrationHandler = async (c: Context) => {
		try {
			const integrationId = c.req.param("integrationId");
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				return respondError(
					c,
					ErrorCode.UNAUTHENTICATED,
					undefined,
					"User ID not found or invalid.",
				);
			}
			if (!integrationId) {
				return respondError(
					c,
					ErrorCode.VALIDATION_ERROR,
					undefined,
					"integrationId path parameter is required",
				);
			}
			// @ts-ignore
			const result = await deleteUseCase({ integrationId, userId });
			if (!result.success) {
				return respondError(c, ErrorCode.NOT_FOUND, undefined, result.message);
			}
			return respondSuccess(
				c,
				{ message: result.message },
				"Notion連携を削除しました",
			);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				message,
				"Notion連携の削除に失敗しました",
			);
		}
	};

	// Instantiate the new handler
	const listUserAccessibleDatabasesHandler =
		listUserAccessibleDatabasesHandlerFactory(listDatabasesUseCase);

	return {
		createIntegrationHandler,
		listIntegrationsHandler,
		deleteIntegrationHandler,
		listUserAccessibleDatabasesHandler, // Added new handler
	};
}
