// src/presentation/handlers/notionWebhookHandler.ts
import type { Context } from "hono";
import type { ProcessNotionWebhookInput } from "../../application/usecases/processNotionWebhookUseCase";
import type { InitializedUseCases } from "../../di";

export const notionWebhookHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	console.log("--- notionWebhookHandler called ---"); // リクエスト時ログ
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
		await useCases.processNotionWebhookUseCase(notionData);

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
