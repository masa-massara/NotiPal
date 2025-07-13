import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
export interface GetTemplateInput {
    id: string;
    userId: string;
}
export type GetTemplateOutput = Template | null;
export declare const createGetTemplateUseCase: (deps: {
    templateRepository: TemplateRepository;
}) => (input: {
    id: string;
    userId: string;
}) => Promise<Template | null>;
