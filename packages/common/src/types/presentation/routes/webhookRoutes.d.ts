import type { InitializedUseCases } from "../../di";
export declare const createWebhookRoutes: (useCases: InitializedUseCases) => import("hono/hono-base").HonoBase<import("hono").Env, {
    "/notion": {
        $post: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/">;
