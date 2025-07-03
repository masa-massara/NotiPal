import { apiClient } from "../lib/apiClient";

// MEMO: NotionDatabase, NotionPropertyは一時的な型定義（本来は共通パッケージに移すべき）
type NotionDatabase = { id: string; name: string };
type NotionProperty = {
	id: string;
	name: string;
	type: string;
	options?: { id: string; name: string; color?: string }[];
};

export async function getNotionDatabases(
	integrationId: string,
): Promise<NotionDatabase[]> {
	const response = await apiClient.me["notion-integrations"][
		":integrationId"
	].databases.$get({ param: { integrationId } });

	if (!response.ok) {
		throw new Error("Failed to fetch Notion databases");
	}

	const data = await response.json();
	return data as NotionDatabase[];
}

export async function getNotionDatabaseProperties(
	integrationId: string,
	databaseId: string,
): Promise<NotionProperty[]> {
	const response = await apiClient["notion-databases"][":databaseId"][
		"properties"
	].$get({ param: { databaseId }, query: { integrationId } });

	if (!response.ok) {
		throw new Error("Failed to fetch Notion database properties");
	}

	const data = await response.json();
	return data as NotionProperty[];
}

// MEMO: NotionDatabase, NotionPropertyのzodスキーマが@notipal/commonに未定義のため、
// 現状はAPIレスポンスの型安全なzodバリデーションは未対応。
// 共通スキーマ追加後にapiResponseSchemaでの検証を推奨。
