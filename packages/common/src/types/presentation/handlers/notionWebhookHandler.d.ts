import type { Context } from "hono";
import type { ProcessNotionWebhookInput } from "../../application/usecases/processNotionWebhookUseCase";
export declare const notionWebhookHandlerFactory: (processNotionWebhookUseCase: (input: ProcessNotionWebhookInput) => Promise<void>) => (c: Context) => Promise<Response>;
