export interface NotionPropertySchema {
    id: string;
    name: string;
    type: string;
    options?: Array<{
        id: string;
        name: string;
        color?: string;
    }>;
}
export interface NotionDatabaseSchema {
    id: string;
    title: string;
    properties: Record<string, NotionPropertySchema>;
}
export interface AccessibleNotionDatabase {
    id: string;
    name: string;
}
export interface NotionApiService {
    /**
     * 指定されたデータベースIDのスキーマ情報（プロパティ定義など）を取得する
     * @param databaseId 取得対象のNotionデータベースID
     * @param userNotionToken ユーザー固有のNotionインテグレーションTOKEN
     * @returns データベーススキーマ情報、または見つからない場合はnull
     */
    getDatabaseSchema(databaseId: string, userNotionToken: string): Promise<NotionDatabaseSchema | null>;
    /**
     * 指定されたユーザーのNotionインテグレーションTOKENを使用して、
     * そのユーザーがアクセス可能なNotionデータベースの一覧を取得する。
     * @param userNotionToken ユーザー固有のNotionインテグレーションTOKEN
     * @returns アクセス可能なNotionデータベースの配列 (id と name を含むオブジェクトの配列)
     */
    listAccessibleDatabases(userNotionToken: string): Promise<AccessibleNotionDatabase[]>;
}
