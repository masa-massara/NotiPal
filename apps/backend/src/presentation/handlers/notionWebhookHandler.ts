// src/presentation/handlers/notionWebhookHandler.ts
import type { Context } from "hono";
import type { ProcessNotionWebhookInput } from "../../application/usecases/processNotionWebhookUseCase";

// 型定義をexecuteメソッド持ちから、関数型に変更
export const notionWebhookHandlerFactory = (
	processNotionWebhookUseCase: (
		input: ProcessNotionWebhookInput,
	) => Promise<void>,
) => {
	console.log("--- notionWebhookHandlerFactory called ---"); // 起動時ログ
	return async (c: Context): Promise<Response> => {
		console.log("--- notionWebhookHandler (actual handler) called ---"); // リクエスト時ログ
		try {
			const notionData = await c.req.json<ProcessNotionWebhookInput>();
			console.log(
				"Received Notion Webhook data:",
				JSON.stringify(notionData, null, 2),
			);

			// (ここにリクエストの認証処理を入れるのが望ましい)
			// 例: const signature = c.req.header('X-Notion-Signature-V1');
			//      if (!isValidSignature(notionData, signature)) {
			//        return c.json({ error: 'Invalid signature' }, 401);
			//      }

			// ユースケースに処理を依頼
			await processNotionWebhookUseCase(notionData);

			// NotionのWebhookは、通常200 OKを返せばOKなことが多い
			// (非同期で処理を進める場合)
			return c.json({ message: "Webhook received" }, 200);
		} catch (error: unknown) {
			console.error("Error in notionWebhookHandler:", error);
			const message = error instanceof Error ? error.message : String(error);
			return c.json(
				{ error: "Failed to process Notion webhook", details: message },
				500,
			);
		}
	};
};
