import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

// Templateの条件部分のスキーマ
export const templateConditionSchema = z.object({
	propertyId: z.string().describe("NotionのプロパティIDまたは名前"),
	operator: z.string().describe("比較演算子"),
	value: z.any().optional().describe("比較する値"),
});

// DBやドメインモデルで使う、完全な形のスキーマ
export const templateSchema = z.object({
	id: z.string().uuid().describe("テンプレートのユニークID"),
	userId: z.string().min(1).describe("このテンプレートを所有するユーザーのID"),
	name: z.string().min(1, { message: "テンプレート名は必須です。" }).describe("テンプレートの管理名"),
	notionDatabaseId: z.string().min(1).describe("通知のトリガーとなるNotionデータベースのID"),
	userNotionIntegrationId: z.string().nullable().describe("このテンプレートが使用するUser Notion IntegrationのID"),
	body: z.string().min(1, { message: "メッセージ本文は必須です。" }).describe("通知メッセージの本文"),
	conditions: z.array(templateConditionSchema).describe("通知条件のリスト (AND条件)"),
	destinationId: z.string().min(1, { message: "通知先は必須です。" }).describe("通知を送信する先のDestinationのID"),
	createdAt: z.preprocess((arg) => {
		if (arg instanceof Timestamp) return arg.toDate();
		if (typeof arg === "string" || typeof arg === "number") return new Date(arg);
		return arg;
	}, z.date()).describe("作成日時"),
	updatedAt: z.preprocess((arg) => {
		if (arg instanceof Timestamp) return arg.toDate();
		if (typeof arg === "string" || typeof arg === "number") return new Date(arg);
		return arg;
	}, z.date()).describe("更新日時"),
});

// APIの入力用スキーマ (新規作成時)
export const createTemplateApiSchema = templateSchema.pick({
    name: true,
    notionDatabaseId: true,
    userNotionIntegrationId: true,
    body: true,
    conditions: true,
    destinationId: true,
}).extend({
    // userNotionIntegrationIdはnullableじゃない入力にしたいので上書き
    userNotionIntegrationId: z.string().min(1, { message: "Notion連携は必須です。"}),
});

// APIの入力用スキーマ (更新時)
export const updateTemplateApiSchema = createTemplateApiSchema.partial();

// TypeScriptの型定義もエクスポート
export type Template = z.infer<typeof templateSchema>;
export type TemplateCondition = z.infer<typeof templateConditionSchema>;
export type CreateTemplateApiInput = z.infer<typeof createTemplateApiSchema>;
export type UpdateTemplateApiInput = z.infer<typeof updateTemplateApiSchema>; 
