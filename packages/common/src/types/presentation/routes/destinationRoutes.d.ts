import type { InitializedUseCases } from "../../di";
export declare const createDestinationRoutes: (useCases: InitializedUseCases) => import("hono/hono-base").HonoBase<{
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
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {};
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
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $put: {
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
            status: import("hono/utils/http-status").ContentfulStatusCode;
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
            output: null;
            outputFormat: "body";
            status: 204;
        };
    };
}, "/">;
