import type { Template } from "@notipal/common";
export interface TemplateRepository {
    save(template: Template): Promise<void>;
    findById(id: string, userId: string): Promise<Template | null>;
    findByNotionDatabaseId(notionDatabaseId: string, userId: string): Promise<Template[]>;
    /**
     * 指定されたNotionのデータベースIDに一致する全てのテンプレートを取得する（ユーザーを問わない）。
     * 主にWebhook処理のように、特定のユーザーコンテキストなしに
     * 関連する全てのテンプレートを処理する必要がある場合に使用する。
     * @param notionDatabaseId NotionのデータベースID
     */
    findAllByNotionDatabaseId(notionDatabaseId: string): Promise<Template[]>;
    deleteById(id: string, userId: string): Promise<void>;
    findAll(userId: string): Promise<Template[]>;
}
