import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createNotionDatabaseRoutes: (useCases: InitializedUseCases) => OpenAPIHono<{
    Variables: {
        userId: string;
    };
}, {
    "/:databaseId/properties": {
        $get: {
            input: {
                param: {
                    databaseId: string;
                };
            } & {
                query: {
                    integrationId: string;
                };
            };
            output: {
                type: string;
                name: string;
                id: string;
                options?: {
                    name: string;
                    id: string;
                    color?: string | undefined;
                }[] | undefined;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
