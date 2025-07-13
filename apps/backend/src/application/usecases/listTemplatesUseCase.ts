import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";

export const createListTemplatesUseCase = (deps: {
	templateRepository: TemplateRepository;
}) => {
	return async (input: { userId: string }): Promise<Template[]> => {
		const templates = await deps.templateRepository.findAll(input.userId);
		return templates;
	};
};
