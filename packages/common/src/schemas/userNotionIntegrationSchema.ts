import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

// APIレスポンスなど、外部に見せても良い情報のスキーマ
export const userNotionIntegrationSchema = z.object({
	id: z.string().uuid().describe("Notion連携のユニークID"),
	userId: z.string().min(1).describe("この連携を所有するユーザーのID"),
	integrationName: z.string().min(1).describe("連携の管理名"),
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

// バックエンド内部で暗号化トークンを扱うためのスキーマ (外部には公開しない)
export const internalUserNotionIntegrationSchema = userNotionIntegrationSchema.extend({
    notionIntegrationToken: z.string().min(1).describe("暗号化されたNotion Integration Token"),
});

// APIの入力用スキーマ (新規登録時)
export const createUserNotionIntegrationApiSchema = z.object({
	integrationName: z.string().min(1, { message: "連携名は必須です。" }),
	notionIntegrationToken: z.string().min(1, { message: "Notionトークンは必須です。" }),
});

// TypeScriptの型定義
export type UserNotionIntegration = z.infer<typeof userNotionIntegrationSchema>;
export type InternalUserNotionIntegration = z.infer<typeof internalUserNotionIntegrationSchema>;
export type CreateUserNotionIntegrationApiInput = z.infer<typeof createUserNotionIntegrationApiSchema>; 
