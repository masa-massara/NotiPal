// src/infrastructure/web-clients/notionApiClient.ts (または application/services/notionApiService.ts)
import { Client } from "@notionhq/client";
import type {
	DatabaseObjectResponse,
	SearchResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { CacheService } from "../../application/services/cacheService"; // ★ CacheService をインポート
import type {
	AccessibleNotionDatabase, // Import new interface
	NotionApiService,
	NotionDatabaseSchema,
	NotionPropertySchema,
} from "../../domain/services/notionApiService";

const CACHE_TTL_SECONDS = 1800; // 例: 30分キャッシュ (30 * 60)

export class NotionApiClient implements NotionApiService {
	private cacheService: CacheService; // ★ CacheService を保持するプロパティ

	constructor(cacheService: CacheService) {
		// notionIntegrationToken removed
		// ★ 引数に cacheService を追加
		this.cacheService = cacheService; // ★ cacheService をプロパティに設定
		console.log("NotionApiClient initialized with CacheService.");
	}

	async getDatabaseSchema(
		databaseId: string,
		userNotionToken: string, // Added userNotionToken
	): Promise<NotionDatabaseSchema | null> {
		const cacheKey = `notion_db_schema_${databaseId}`; // キャッシュ用のキー

		// 1. まずキャッシュを確認
		const cachedSchema =
			await this.cacheService.get<NotionDatabaseSchema>(cacheKey);
		if (cachedSchema) {
			console.log(
				`NotionApiClient: Cache hit for database schema ID: ${databaseId}`,
			);
			return cachedSchema;
		}
		console.log(
			`NotionApiClient: Cache miss for database schema ID: ${databaseId}. Fetching from API...`,
		);

		// 2. キャッシュになければAPIから取得
		try {
			// Instantiate Notion Client here, using the userNotionToken
			const notion = new Client({ auth: userNotionToken });

			const response = await notion.databases.retrieve({
				// Use the new notion client
				database_id: databaseId,
			});

			if (
				response.object !== "database" ||
				!("title" in response) ||
				!("properties" in response)
			) {
				console.error(
					"NotionApiClient: Response is not a full database object for schema.",
				);
				return null;
			}
			// ★ mapResponseToSchema に渡す前に、response が DatabaseObjectResponse 型であることを保証する
			// (型ガードやアサーションが適切に行われている前提)
			const schema = this.mapResponseToSchema(
				response as DatabaseObjectResponse,
			);

			// 3. 取得したデータをキャッシュに保存
			if (schema) {
				await this.cacheService.set(cacheKey, schema, CACHE_TTL_SECONDS);
				console.log(
					`NotionApiClient: Schema for ${databaseId} saved to cache.`,
				);
			}
			return schema;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error(
				`NotionApiClient: Error fetching database schema for ID ${databaseId}:`,
				error.code || error.name,
				error.body || error.message,
			);
			if (error.code === "object_not_found" || error.status === 404) {
				return null;
			}
			throw error;
		}
	}

	// mapResponseToSchema メソッドは前回修正したやつをそのまま使う
	private mapResponseToSchema(
		response: DatabaseObjectResponse,
	): NotionDatabaseSchema {
		const databaseTitle =
			Array.isArray(response.title) && response.title.length > 0
				? response.title
						.map((t: { plain_text: string }) => t.plain_text)
						.join("")
				: "Untitled Database";

		const properties: Record<string, NotionPropertySchema> = {};
		for (const [propertyName, propDataObject] of Object.entries(
			response.properties,
		)) {
			const propData =
				propDataObject as DatabaseObjectResponse["properties"][string];
			let optionsArray:
				| Array<{ id: string; name: string; color?: string }>
				| undefined = undefined;
			if (propData.type === "select" && propData.select) {
				optionsArray = propData.select.options.map(
					(opt: {
						id: string;
						name: string;
						color?: string;
					}) => ({
						id: opt.id,
						name: opt.name,
						color: opt.color,
					}),
				);
			} else if (propData.type === "multi_select" && propData.multi_select) {
				optionsArray = propData.multi_select.options.map(
					(opt: {
						id: string;
						name: string;
						color?: string;
					}) => ({
						id: opt.id,
						name: opt.name,
						color: opt.color,
					}),
				);
			} else if (propData.type === "status" && propData.status) {
				optionsArray = propData.status.options.map(
					(opt: {
						id: string;
						name: string;
						color?: string;
					}) => ({
						id: opt.id,
						name: opt.name,
						color: opt.color,
					}),
				);
			}
			properties[propertyName] = {
				id: propData.id,
				name: propData.name,
				type: propData.type,
				options: optionsArray,
			};
		}
		return {
			id: response.id,
			title: databaseTitle,
			properties: properties,
		};
	}

	// ADD THIS METHOD IMPLEMENTATION
	async listAccessibleDatabases(
		userNotionToken: string,
	): Promise<AccessibleNotionDatabase[]> {
		const notion = new Client({ auth: userNotionToken });
		const databases: AccessibleNotionDatabase[] = [];
		let hasMore = true;
		let startCursor: string | undefined = undefined;

		// ログ 13: メソッド実行開始
		console.log("【BE Log 13 at NotionClient】listAccessibleDatabases - Entry");

		try {
			while (hasMore) {
				// ログ 14: Notion API (search) 呼び出し直前
				console.log(`【BE Log 14 at NotionClient】Calling notion.search with start_cursor: ${startCursor}`);
				const response: SearchResponse = await notion.search({
					filter: { value: "database", property: "object" },
					page_size: 100,
					start_cursor: startCursor,
				});
				// ログ 15: Notion API (search) のレスポンス概要
				console.log(`【BE Log 15 at NotionClient】notion.search response - has_more: ${response.has_more}, next_cursor: ${response.next_cursor}, results_count: ${response.results.length}`);
				// console.log("【BE Log 15.1 at NotionClient】notion.search results (raw):", JSON.stringify(response.results, null, 2));

				for (const dbResult of response.results) {
					if (dbResult.object === "database" && "title" in dbResult) {
						if (Array.isArray(dbResult.title) && dbResult.title.length > 0 && "plain_text" in dbResult.title[0]) {
							const dbName = dbResult.title.map((t: any) => t.plain_text).join("");
							databases.push({ id: dbResult.id, name: dbName });
							// ログ 16.1: データベースとして認識・追加
							console.log(`【BE Log 16.1 at NotionClient】Found database: ID=${dbResult.id}, Name=${dbName}`);
						} else {
							// タイトルが期待した形式でない場合
							console.warn(
								`【BE Log 16.2 at NotionClient】Database object found (ID: ${dbResult.id}) but title format is unexpected. Skipping. Title:`,
								JSON.stringify(dbResult.title, null, 2),
							);
						}
					} else {
						// ログ 16.3: データベースオブジェクトではない、またはタイトルがない
						console.warn(
							`【BE Log 16.3 at NotionClient】Search result (ID: ${'id' in dbResult ? dbResult.id : 'N/A'}) is not a valid database object with title. Object type: ${dbResult.object}. Skipping.`,
						);
					}
				}

				hasMore = response.has_more;
				startCursor = response.next_cursor || undefined;
			}
			// ログ 17: 最終的に見つかったデータベースの数
			console.log(`【BE Log 17 at NotionClient】Finished fetching. Total accessible databases found: ${databases.length}`);
			return databases;
		} catch (error: any) {
			// ログ 18: API呼び出し中のエラー
			console.error(
				"【BE Log 18 at NotionClient】Error listing accessible databases from Notion API:",
				error.code || error.name,
				error.message,
				error.body ? `Body: ${error.body}` : ""
			);
			throw error;
		}
	}
}
