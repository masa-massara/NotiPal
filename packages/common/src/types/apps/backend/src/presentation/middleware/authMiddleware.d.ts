import { type Auth } from "firebase-admin/auth";
import type { MiddlewareHandler } from "hono";
export declare const createAuthMiddleware: (authInstance: Auth) => MiddlewareHandler;
