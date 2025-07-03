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
				// Re-throw HTTPException directly if it's already one
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

import type { InitializedUseCases } from "../../di";

export function createUserNotionIntegrationHandlers(
	useCases: InitializedUseCases,
) {
	// Create
	const createIntegrationHandler = async (c: Context) => {
		try {
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				throw new HTTPException(401, {
					message: "User ID not found or invalid.",
				});
			}
			const body = await c.req.json();
			const parseResult = createUserNotionIntegrationApiSchema.safeParse(body);
			if (!parseResult.success) {
				throw new HTTPException(400, {
					message: "Validation Error",
					cause: parseResult.error.format(),
				});
			}
			const input = { userId, ...parseResult.data };
			const output = await useCases.createUserNotionIntegrationUseCaseFn(input);
			return c.json(output, 201);
		} catch (error: unknown) {
			if (error instanceof HTTPException) {
				throw error;
			}
			const message = error instanceof Error ? error.message : String(error);
			throw new HTTPException(500, {
				message: "Failed to create Notion integration",
				cause: message,
			});
		}
	};

	// List
	const listIntegrationsHandler = async (c: Context) => {
		try {
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				throw new HTTPException(401, {
					message: "User ID not found or invalid.",
				});
			}
			const output = await useCases.listUserNotionIntegrationsUseCaseFn({
				userId,
			});
			return c.json(output);
		} catch (error: unknown) {
			if (error instanceof HTTPException) {
				throw error;
			}
			const message = error instanceof Error ? error.message : String(error);
			throw new HTTPException(500, {
				message: "Failed to list Notion integrations",
				cause: message,
			});
		}
	};

	// Delete
	const deleteIntegrationHandler = async (c: Context) => {
		try {
			const integrationId = c.req.param("integrationId");
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				throw new HTTPException(401, {
					message: "User ID not found or invalid.",
				});
			}
			if (!integrationId) {
				throw new HTTPException(400, {
					message: "integrationId path parameter is required",
				});
			}
			const result = await useCases.deleteUserNotionIntegrationUseCaseFn({
				integrationId,
				userId,
			});
			if (!result.success) {
				throw new HTTPException(404, {
					message: result.message,
				});
			}
			return c.body(null, 204);
		} catch (error: unknown) {
			if (error instanceof HTTPException) {
				throw error;
			}
			const message = error instanceof Error ? error.message : String(error);
			throw new HTTPException(500, {
				message: "Failed to delete Notion integration",
				cause: message,
			});
		}
	};

	// Instantiate the new handler
	const listUserAccessibleDatabasesHandler =
		listUserAccessibleDatabasesHandlerFactory(
			useCases.listNotionDatabasesUseCase,
		);

	return {
		createIntegrationHandler,
		listIntegrationsHandler,
		deleteIntegrationHandler,
		listUserAccessibleDatabasesHandler, // Added new handler
	};
}
