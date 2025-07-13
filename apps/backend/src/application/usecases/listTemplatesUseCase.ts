export const createListTemplatesUseCase = (deps: {
	templateRepository: TemplateRepository;
}) => {
	return async (input: { userId: string }): Promise<Template[]> => {
		const templates = await deps.templateRepository.findAll(input.userId);
		return templates;
	};
};
