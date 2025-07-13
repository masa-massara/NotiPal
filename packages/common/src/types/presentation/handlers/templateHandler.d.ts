import { type CreateTemplateApiInput, type Template, type UpdateTemplateApiInput } from "@notipal/common";
import type { Context, TypedResponse } from "hono";
type CreateTemplateUseCaseFn = (input: CreateTemplateApiInput & {
    userId: string;
}) => Promise<Template>;
type CreateTemplateHandlerContext = Context<{
    Variables: {
        userId: string;
    };
    in: {
        json: CreateTemplateApiInput;
    };
}>;
export declare const createTemplateHandler: (createUseCase: CreateTemplateUseCaseFn) => (c: CreateTemplateHandlerContext) => Promise<TypedResponse<Template, 201, "json">>;
type GetTemplateContext = Context<{
    Variables: {
        userId: string;
    };
}>;
type GetTemplateUseCaseFn = (input: {
    id: string;
    userId: string;
}) => Promise<Template | null>;
export declare const getTemplateByIdHandler: (getUseCase: GetTemplateUseCaseFn) => (c: GetTemplateContext) => Promise<TypedResponse<Template | null, 200 | 404, "json">>;
type ListTemplatesContext = Context<{
    Variables: {
        userId: string;
    };
}>;
type ListTemplatesUseCaseFn = (input: {
    userId: string;
}) => Promise<Template[]>;
export declare const listTemplatesHandler: (listUseCase: ListTemplatesUseCaseFn) => (c: ListTemplatesContext) => Promise<TypedResponse<Template[], 200, "json">>;
type UpdateTemplateUseCaseFn = (input: UpdateTemplateApiInput & {
    id: string;
    userId: string;
}) => Promise<Template>;
type UpdateTemplateHandlerContext = Context<{
    Variables: {
        userId: string;
    };
    in: {
        json: UpdateTemplateApiInput;
    };
}>;
export declare const updateTemplateHandler: (updateUseCase: UpdateTemplateUseCaseFn) => (c: UpdateTemplateHandlerContext) => Promise<TypedResponse<Template, 200 | 404, "json">>;
type DeleteTemplateContext = Context<{
    Variables: {
        userId: string;
    };
}>;
type DeleteTemplateUseCaseFn = (input: {
    id: string;
    userId: string;
}) => Promise<void>;
export declare const deleteTemplateHandler: (deleteUseCase: DeleteTemplateUseCaseFn) => (c: DeleteTemplateContext) => Promise<TypedResponse<null, 204 | 404, "body">>;
export {};
