import type { Template } from "@notipal/common";
import type { NotionDatabaseSchema } from "./notionApiService";
type NotionPagePropertyValue = any;
type NotionPageProperties = Record<string, NotionPagePropertyValue>;
/**
 * 指定されたページプロパティとテンプレート条件に一致するテンプレートをフィルタリングする
 */
export declare function findMatchingTemplates(pageProperties: NotionPageProperties, templates: Template[], databaseSchema: NotionDatabaseSchema): Template[];
export {};
