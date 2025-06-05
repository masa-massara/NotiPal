import { HTTPException } from "hono/http-exception";
// src/application/usecases/listNotionDatabasesUseCase.ts
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type {
	ListNotionDatabasesInput,
	ListNotionDatabasesOutput,
	NotionDatabaseOutputItem,
} from "../dtos/notionDatabaseDTOs";
import type { EncryptionService } from "../services/encryptionService";

export const createListNotionDatabasesUseCase = (deps: {
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
	encryptionService: EncryptionService;
	notionApiService: NotionApiService;
}) => {
	const {
		userNotionIntegrationRepository,
		encryptionService,
		notionApiService,
	} = deps;

	return async (
		input: ListNotionDatabasesInput,
	): Promise<ListNotionDatabasesOutput> => {
		const { integrationId, userId } = input;

		// ログ 6: ユースケース実行開始
		console.log(
			`【BE Log 6 at UseCase】ListNotionDatabasesUseCase - Entry for integrationId: ${integrationId}, userId: ${userId}`,
		);

		// 1. Fetch UserNotionIntegration
		const integration = await userNotionIntegrationRepository.findById(
			integrationId,
			userId,
		);
		// ログ 7: 連携情報の取得結果
		console.log(
			"【BE Log 7 at UseCase】Fetched UserNotionIntegration:",
			integration
				? `ID: ${integration.id}, Name: ${integration.integrationName}`
				: "Not Found",
		);

		if (!integration) {
			console.warn(
				`【BE Log 7.1 at UseCase】Notion integration with ID ${integrationId} not found or not accessible by user.`,
			);
			throw new HTTPException(404, {
				message: `Notion integration with ID ${integrationId} not found or not accessible by user.`,
				cause: "UserNotionIntegrationNotFound",
			});
		}

		// 2. Decrypt notionIntegrationToken
		let decryptedToken: string;
		try {
			decryptedToken = await encryptionService.decrypt(
				integration.notionIntegrationToken,
			);
			// ログ 8: トークン復号化成功
			console.log(
				`【BE Log 8 at UseCase】Token decrypted successfully for integration ID ${integrationId}.`,
			);
		} catch (error) {
			console.error(
				`【BE Log 8.1 at UseCase】Failed to decrypt token for integration ID ${integrationId}:`,
				error,
			);
			throw new HTTPException(500, {
				message: "Failed to decrypt Notion integration token.",
				cause: "DecryptionError",
			});
		}

		// 3. Call notionApiService.listAccessibleDatabases()
		try {
			// ログ 9: NotionApiService呼び出し直前
			console.log(
				`【BE Log 9 at UseCase】Calling notionApiService.listAccessibleDatabases for integration ID: ${integrationId}`,
			);
			const accessibleDatabases =
				await notionApiService.listAccessibleDatabases(decryptedToken);
			// ログ 10: NotionApiServiceからの戻り値
			console.log(
				"【BE Log 10 at UseCase】notionApiService.listAccessibleDatabases returned:",
				JSON.stringify(accessibleDatabases, null, 2),
			);

			// 4. Map to ListNotionDatabasesOutput
			const output: ListNotionDatabasesOutput = accessibleDatabases.map(
				(db) => ({
					id: db.id,
					name: db.name,
				}),
			);
			// ログ 11: 最終的な出力
			console.log(
				`【BE Log 11 at UseCase】Final output for integration ID ${integrationId}:`,
				JSON.stringify(output, null, 2),
			);
			return output;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			// ログ 12: NotionApiService呼び出し中のエラー
			console.error(
				`【BE Log 12 at UseCase】Error fetching accessible databases from Notion API for integration ID ${integrationId}:`,
				error.message,
				error.cause ? `Cause: ${JSON.stringify(error.cause)}` : "",
			);
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message:
					"An error occurred while fetching accessible databases from Notion.",
				cause: error.message || "NotionApiError",
			});
		}
	};
};
