// src/presentation/handlers/userNotionIntegrationHandler.ts

import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

// Existing Use Case Imports
import type { CreateUserNotionIntegrationUseCase } from "../../application/usecases/createUserNotionIntegrationUseCase";
import type { DeleteUserNotionIntegrationUseCase } from "../../application/usecases/deleteUserNotionIntegrationUseCase";
import type { ListUserNotionIntegrationsUseCase } from "../../application/usecases/listUserNotionIntegrationsUseCase";

// New Use Case Import
import type { ListNotionDatabasesUseCase } from "../../application/usecases/listNotionDatabasesUseCase"; // Added

// Existing DTO Imports
import type {
	CreateUserNotionIntegrationInput,
	CreateUserNotionIntegrationOutput,
	DeleteUserNotionIntegrationInput,
} from "../../application/dtos/userNotionIntegrationDTOs";

// New DTO Imports
import type {
	ListNotionDatabasesInput,
	ListNotionDatabasesOutput,
} from "../../application/dtos/notionDatabaseDTOs"; // Added

// Factory function for the new handler
function listUserAccessibleDatabasesHandlerFactory(
	useCase: ListNotionDatabasesUseCase,
) {
	return async (c: Context) => {
		// ログ 1: ハンドラ呼び出し確認
		console.log("【BE Log 1 at Handler】listUserAccessibleDatabasesHandler - Entry");
		try {
			const integrationId = c.req.param("integrationId");
			const userId = c.var.userId;

			// ログ 2: パラメータとuserIdの確認
			console.log(`【BE Log 2 at Handler】Integration ID: ${integrationId}, User ID: ${userId}`);

			if (typeof userId !== "string") {
				console.error(
					"【BE Log 2.1 at Handler】CRITICAL: userId not found in context or is not a string after authMiddleware.",
				);
				throw new HTTPException(401, {
					message: "Unauthorized: User ID not found or invalid.",
				});
			}
			if (!integrationId) {
				console.error("【BE Log 2.2 at Handler】integrationId path parameter is required.");
				throw new HTTPException(400, {
					message: "integrationId path parameter is required",
				});
			}

			const input: ListNotionDatabasesInput = {
				integrationId,
				userId,
			};

			// ログ 3: ユースケース呼び出し直前
			console.log("【BE Log 3 at Handler】Calling ListNotionDatabasesUseCase with input:", JSON.stringify(input, null, 2));
			const output: ListNotionDatabasesOutput = await useCase.execute(input);
			// ログ 4: ユースケースからの戻り値
			console.log("【BE Log 4 at Handler】ListNotionDatabasesUseCase returned output:", JSON.stringify(output, null, 2));

			return c.json(output, 200);
		} catch (error: any) {
			// ログ 5: エラー発生時
			console.error("【BE Log 5 at Handler】Error in listUserAccessibleDatabasesHandler:", error.message, error.cause ? `Cause: ${JSON.stringify(error.cause)}` : "");
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message: "Failed to list accessible Notion databases",
				cause: error.message || error,
			});
		}
	};
}

export function createUserNotionIntegrationHandlers(
	createUseCase: CreateUserNotionIntegrationUseCase,
	listUseCase: ListUserNotionIntegrationsUseCase,
	deleteUseCase: DeleteUserNotionIntegrationUseCase,
	listDatabasesUseCase: ListNotionDatabasesUseCase, // Added new parameter
) {
	const createIntegrationHandler = async (c: Context) => {
		try {
			const { integrationName, notionIntegrationToken } = await c.req.json<{
				integrationName: string;
				notionIntegrationToken: string;
			}>();
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				console.error(
					"CRITICAL: userId not found in context or is not a string after authMiddleware.",
				);
				throw new HTTPException(401, {
					message: "Unauthorized: User ID not found or invalid.",
				});
			}
			if (!integrationName || !notionIntegrationToken) {
				throw new HTTPException(400, {
					message: "integrationName and notionIntegrationToken are required",
				});
			}
			const input: CreateUserNotionIntegrationInput = {
				userId,
				integrationName,
				notionIntegrationToken,
			};
			const output = await createUseCase.execute(input);
			return c.json(output, 201);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error("Error in createIntegrationHandler:", error);
			if (error instanceof HTTPException) throw error;
			throw new HTTPException(500, {
				message: "Failed to create Notion integration",
				cause: error,
			});
		}
	};

	const listIntegrationsHandler = async (c: Context) => {
		try {
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				console.error(
					"CRITICAL: userId not found in context or is not a string after authMiddleware.",
				);
				throw new HTTPException(401, {
					message: "Unauthorized: User ID not found or invalid.",
				});
			}
			const output = await listUseCase.execute({ userId });
			return c.json(output, 200);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error("Error in listIntegrationsHandler:", error);
			if (error instanceof HTTPException) throw error; // Propagate HTTPException
			throw new HTTPException(500, {
				message: "Failed to list Notion integrations",
				cause: error,
			});
		}
	};

	const deleteIntegrationHandler = async (c: Context) => {
		try {
			const integrationId = c.req.param("integrationId");
			const userId = c.var.userId;
			if (typeof userId !== "string") {
				console.error(
					"CRITICAL: userId not found in context or is not a string after authMiddleware.",
				);
				throw new HTTPException(401, {
					message: "Unauthorized: User ID not found or invalid.",
				});
			}
			if (!integrationId) {
				throw new HTTPException(400, {
					message: "integrationId path parameter is required",
				});
			}
			const input: DeleteUserNotionIntegrationInput = {
				integrationId,
				userId,
			};
			const result = await deleteUseCase.execute(input);
			if (!result.success) {
				// Use a more specific error from the use case if available, otherwise default
				throw new HTTPException(404, {
					message:
						result.message ||
						`Notion integration with ID ${integrationId} not found or action failed.`,
				});
			}
			return c.json({ message: result.message }, 200);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error("Error in deleteIntegrationHandler:", error);
			if (error instanceof HTTPException) throw error; // Propagate HTTPException
			throw new HTTPException(500, {
				message: "Failed to delete Notion integration",
				cause: error,
			});
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
