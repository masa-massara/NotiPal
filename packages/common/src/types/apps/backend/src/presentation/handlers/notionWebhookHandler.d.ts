import type { Context } from "hono";
import type { InitializedUseCases } from "../../di";
export declare const notionWebhookHandler: (c: Context, useCases: InitializedUseCases) => Promise<(Response & import("hono").TypedResponse<{
    message: string;
}, 200, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
    details: string;
}, 500, "json">)>;
