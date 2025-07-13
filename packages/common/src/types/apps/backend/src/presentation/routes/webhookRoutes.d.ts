import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createWebhookRoutes: (useCases: InitializedUseCases) => OpenAPIHono<import("hono").Env, {
    "/notion": {
        $post: {
            input: {
                json: unknown;
            };
            output: {
                error: string;
                details: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: unknown;
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
