import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createDestinationRoutes: (useCases: InitializedUseCases) => OpenAPIHono<{
    Variables: {
        userId: string;
    };
}, {
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    webhookUrl: string;
                    name?: string | undefined;
                };
            };
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $put: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    webhookUrl?: string | undefined;
                };
            };
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {};
            outputFormat: string;
            status: 204;
        };
    };
}, "/">;
