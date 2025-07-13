import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
export declare const createListTemplatesUseCase: (deps: {
    templateRepository: TemplateRepository;
}) => (input: {
    userId: string;
}) => Promise<Template[]>;
