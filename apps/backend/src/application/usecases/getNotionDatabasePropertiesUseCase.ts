import { HTTPException } from "hono/http-exception";
// src/application/usecases/getNotionDatabasePropertiesUseCase.ts
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type {
	NotionApiService,
	NotionDatabaseSchema,
} from "../../domain/services/notionApiService";
import type {
	GetNotionDatabasePropertiesInput,
	GetNotionDatabasePropertiesOutput,
	NotionPropertyOption,
	NotionPropertyOutputItem,
} from "../dtos/notionDatabaseDTOs";
import type { CacheService } from "../services/cacheService";
import type { EncryptionService } from "../services/encryptionService";

const CACHE_TTL_SECONDS_PROPERTIES = 1800; // 30 minutes, same as schema for consistency

export const createGetNotionDatabasePropertiesUseCase = (deps: {
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
	encryptionService: EncryptionService;
	notionApiService: NotionApiService;
	cacheService: CacheService;
}) => {
	const {
		userNotionIntegrationRepository,
		encryptionService,
		notionApiService,
		cacheService,
	} = deps;

	return async (
		input: GetNotionDatabasePropertiesInput,
	): Promise<GetNotionDatabasePropertiesOutput> => {
		const { databaseId, userId, integrationId } = input;

		if (!integrationId) {
			// As per spec, integrationId is "strongly recommended" but "may be treated as mandatory".
			// For robust behavior and clear authorization, we'll treat it as mandatory here.
			throw new HTTPException(400, {
				message:
					"integrationId query parameter is required to specify which Notion integration to use.",
				cause: "MissingIntegrationId",
			});
		}

		// 1. Fetch UserNotionIntegration
		const integration = await userNotionIntegrationRepository.findById(
			integrationId,
			userId,
		);
		if (!integration) {
			throw new HTTPException(404, {
				message: `Notion integration with ID ${integrationId} not found or not accessible by user.`,
				cause: "UserNotionIntegrationNotFound",
			});
		}

		// 2. Decrypt notionIntegrationToken
		let decryptedToken: string;
		try {
			// Assuming the token property name is 'notionIntegrationToken' based on previous subtask report
			decryptedToken = await encryptionService.decrypt(
				integration.notionIntegrationToken,
			);
		} catch (error) {
			console.error(
				`Failed to decrypt token for integration ID ${integrationId}:`,
				error,
			);
			throw new HTTPException(500, {
				message: "Failed to decrypt Notion integration token.",
				cause: "DecryptionError",
			});
		}

		// 3. Cache Logic
		const cacheKey = `notion_db_properties_${databaseId}_integ_${integrationId}`; // Include integrationId in cache key for safety, though token implies access

		const cachedProperties =
			await cacheService.get<GetNotionDatabasePropertiesOutput>(cacheKey);
		if (cachedProperties) {
			console.log(
				`Cache hit for Notion database properties: ${databaseId} using integration ${integrationId}`,
			);
			return cachedProperties;
		}
		console.log(
			`Cache miss for Notion database properties: ${databaseId} using integration ${integrationId}. Fetching...`,
		);

		// 4. Fetch Schema from NotionApiService
		let notionSchema: NotionDatabaseSchema | null;
		try {
			notionSchema = await notionApiService.getDatabaseSchema(
				databaseId,
				decryptedToken,
			);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error(
				`Error calling getDatabaseSchema for DB ${databaseId} with integration ${integrationId}:`,
				error,
			);
			if (error instanceof HTTPException) throw error; // Re-throw if already an HTTPException
			throw new HTTPException(500, {
				message: "Failed to retrieve database schema from Notion API.",
				cause: error.message || "NotionApiErrorFetchingSchema",
			});
		}

		if (!notionSchema) {
			// This specific databaseId might not be accessible/found with this user's token,
			// or the getDatabaseSchema itself returned null due to Notion API 404.
			throw new HTTPException(404, {
				message: `Notion database with ID ${databaseId} not found or not accessible with the provided integration.`,
				cause: "NotionDatabaseNotFoundOrInaccessible",
			});
		}

		// 5. Transform properties from Record to Array and map to Output DTO
		const outputProperties: GetNotionDatabasePropertiesOutput = Object.values(
			notionSchema.properties,
		).map((propSchema) => {
			const outputItem: NotionPropertyOutputItem = {
				id: propSchema.id,
				name: propSchema.name,
				type: propSchema.type,
			};
			if (propSchema.options) {
				outputItem.options = propSchema.options.map((opt) => ({
					id: opt.id,
					name: opt.name,
					color: opt.color,
				}));
			}
			return outputItem;
		});

		// 6. Store in Cache
		await cacheService.set(
			cacheKey,
			outputProperties,
			CACHE_TTL_SECONDS_PROPERTIES,
		);
		console.log(
			`Notion database properties for ${databaseId} (integration ${integrationId}) stored in cache.`,
		);

		return outputProperties;
	};
};
