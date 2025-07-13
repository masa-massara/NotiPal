import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
export interface ListTemplatesInput {
    userId: string;
}
export type ListTemplatesOutput = Template[];
export declare const createListTemplatesUseCase: (deps: {
    templateRepository: TemplateRepository;
}) => (input: {
    userId: string;
}) => Promise<Template[]>;
