import type { InitializedUseCases } from "../../di";
export declare const createTemplateRoutes: (useCases: InitializedUseCases) => import("hono/hono-base").HonoBase<{
    Variables: {
        userId: string;
    };
}, {
    "/": {
        $get: {
            input: {};
            output: {
                name: string;
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                notionDatabaseId: string;
                userNotionIntegrationId: string | null;
                body: string;
                conditions: {
                    propertyId: string;
                    operator: string;
                    value?: unknown;
                }[];
                destinationId: string;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {};
            output: {
                name: string;
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                notionDatabaseId: string;
                userNotionIntegrationId: string | null;
                body: string;
                conditions: {
                    propertyId: string;
                    operator: string;
                    value?: unknown;
                }[];
                destinationId: string;
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
                name: string;
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                notionDatabaseId: string;
                userNotionIntegrationId: string | null;
                body: string;
                conditions: {
                    propertyId: string;
                    operator: string;
                    value?: unknown;
                }[];
                destinationId: string;
            } | null;
            outputFormat: "json";
            status: 404 | 200;
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
                name: string;
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                notionDatabaseId: string;
                userNotionIntegrationId: string | null;
                body: string;
                conditions: {
                    propertyId: string;
                    operator: string;
                    value?: unknown;
                }[];
                destinationId: string;
            };
            outputFormat: "json";
            status: 404 | 200;
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
            status: 404 | 204;
        };
    };
}, "/">;
