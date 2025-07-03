import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createNotionDatabaseRoutes: (useCases: InitializedUseCases) => OpenAPIHono<{
    Variables: {
        userId: string;
    };
}, {}, "/">;
