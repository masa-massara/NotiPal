import { apiClient } from "../lib/apiClient";

import type { NotionDatabase, NotionProperty } from "@notipal/common";

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
	// APIレスポンスが配列であることを確認し、NotionDatabase型にマッピング
	if (Array.isArray(data)) {
		return (data as NotionDatabase[]).map((db) => ({
			id: db.id,
			name: db.name,
		}));
	}
	return []; // 配列でない場合は空の配列を返す
}

export async function getNotionDatabaseProperties(
	integrationId: string,
	databaseId: string,
): Promise<NotionProperty[]> {
	const response = await apiClient["notion-databases"][
		":databaseId"
	].properties.$get({ param: { databaseId }, query: { integrationId } });

	if (!response.ok) {
		throw new Error("Failed to fetch Notion database properties");
	}

	const data = await response.json();
	// APIレスポンスが配列であることを確認し、NotionProperty型にマッピング
	if (Array.isArray(data)) {
		return (data as NotionProperty[]).map((prop) => ({
			id: prop.id,
			name: prop.name,
			type: prop.type,
			options: prop.options,
		}));
	}
	return []; // 配列でない場合は空の配列を返す
}

// MEMO: NotionDatabase, NotionPropertyのzodスキーマが@notipal/commonに未定義のため、
// 現状はAPIレスポンスの型安全なzodバリデーションは未対応。
// 共通スキーマ追加後にapiResponseSchemaでの検証を推奨。
