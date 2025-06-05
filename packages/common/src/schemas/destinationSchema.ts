import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore"; // バックエンドでの変換用にインポート想定

// DBやドメインモデルで使う、完全な形のスキーマ
export const destinationSchema = z.object({
	id: z.string().uuid().describe("送信先のユニークID"),
	userId: z.string().min(1).describe("この送信先を所有するユーザーのID"),
	name: z.string().optional().describe("送信先の管理名"),
	webhookUrl: z.string().url({ message: "有効なURLを入力してください。" }).describe("通知先サービスのWebhook URL"),
	createdAt: z.preprocess((arg) => {
		// FirestoreのTimestampや文字列をDateに変換する
		if (arg instanceof Timestamp) {
			return arg.toDate();
		}
		if (typeof arg === "string" || typeof arg === "number") {
			return new Date(arg);
		}
		return arg;
	}, z.date()).describe("作成日時"),
	updatedAt: z.preprocess((arg) => {
		if (arg instanceof Timestamp) {
			return arg.toDate();
		}
		if (typeof arg === "string" || typeof arg === "number") {
			return new Date(arg);
		}
		return arg;
	}, z.date()).describe("更新日時"),
});

// APIの入力用スキーマ (id, userId, 日付はAPIからは受け取らない)
export const createDestinationApiSchema = destinationSchema.pick({
    name: true,
    webhookUrl: true,
});

export const updateDestinationApiSchema = createDestinationApiSchema.partial();

// TypeScriptの型定義もエクスポート
export type Destination = z.infer<typeof destinationSchema>;
export type CreateDestinationApiInput = z.infer<typeof createDestinationApiSchema>;
export type UpdateDestinationApiInput = z.infer<typeof updateDestinationApiSchema>; 
