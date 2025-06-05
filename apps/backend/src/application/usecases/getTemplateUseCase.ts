// src/application/usecases/getTemplateUseCase.ts
import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";

// ユースケースの入力 (テンプレートIDとユーザーID)
export interface GetTemplateInput {
	id: string;
	userId: string; // ★★★ Input DTOにuserIdを追加 ★★★
}

// ユースケースの出力 (見つかったテンプレート情報、またはnull)
export type GetTemplateOutput = Template | null;

export const createGetTemplateUseCase = (deps: {
	templateRepository: TemplateRepository;
}) => {
	return async (input: {
		id: string;
		userId: string;
	}): Promise<Template | null> => {
		const template = await deps.templateRepository.findById(
			input.id,
			input.userId,
		);
		if (!template) {
			console.log(
				`Template with id ${input.id} not found for user ${input.userId} by GetTemplateUseCase.`,
			);
			return null;
		}
		return template;
	};
};
