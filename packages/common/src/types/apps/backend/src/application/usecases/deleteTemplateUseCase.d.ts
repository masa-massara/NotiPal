import type { TemplateRepository } from "../../domain/repositories/templateRepository";
export interface DeleteTemplateInput {
    id: string;
    userId: string;
}
export declare const createDeleteTemplateUseCase: (deps: {
    templateRepository: TemplateRepository;
}) => (input: {
    id: string;
    userId: string;
}) => Promise<void>;
