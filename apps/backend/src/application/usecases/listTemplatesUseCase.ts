// src/application/usecases/listTemplatesUseCase.ts
import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";

// ユースケースの入力 (ユーザーID)
export interface ListTemplatesInput {
	// ★ Input DTOを定義
	userId: string;
}

// ユースケースの出力 (テンプレートの配列)
export type ListTemplatesOutput = Template[];

export const createListTemplatesUseCase = (deps: {
	templateRepository: TemplateRepository;
}) => {
	return async (input: { userId: string }): Promise<Template[]> => {
		console.log(
			`ListTemplatesUseCase: Attempting to execute findAll for user ${input.userId}...`,
		); // ★ ログにuserIdを追加
		const templates = await deps.templateRepository.findAll(input.userId); // ★ findAllにuserIdを渡す
		console.log(
			`ListTemplatesUseCase: Found ${templates.length} templates for user ${input.userId}.`,
		); // ★ ログにuserIdを追加
		return templates;
	};
};
