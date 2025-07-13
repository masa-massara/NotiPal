import type { NotionDatabaseSchema } from "./notionApiService";
type NotionPagePropertyValue = any;
type NotionPageProperties = Record<string, NotionPagePropertyValue>;
export interface FormattedMessageResult {
    body: string;
}
export interface MessageFormatterService {
    /**
     * テンプレート本文のプレースホルダを実際のページプロパティ値で置換する
     * @param templateBody プレースホルダを含むテンプレートの本文
     * @param pageProperties Webhookで受信したページのプロパティ
     * @param databaseSchema 対象データベースのスキーマ情報
     * @param pageUrl (オプション) NotionページのURL
     * @returns 整形済みのメッセージ本文
     */
    format(templateBody: string, pageProperties: NotionPageProperties, databaseSchema: NotionDatabaseSchema, pageUrl?: string): Promise<string>;
}
export {};
