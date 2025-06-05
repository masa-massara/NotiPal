// src/application/usecases/deleteTemplateUseCase.ts
import type { TemplateRepository } from "../../domain/repositories/templateRepository";

// ユースケースの入力 (削除するテンプレートのIDとユーザーID)
export interface DeleteTemplateInput {
	id: string;
	userId: string; // ★★★ Input DTOにuserIdを追加 ★★★
}

// ユースケースの出力 (今回はなし。エラーがなければ成功とする)
// export type DeleteTemplateOutput = void; // もし明示するなら

export const createDeleteTemplateUseCase = (deps: {
	templateRepository: TemplateRepository;
}) => {
	return async (input: { id: string; userId: string }): Promise<void> => {
		// ★★★ リポジトリのdeleteByIdメソッドにuserIdを渡す ★★★
		// リポジトリのdeleteByIdが、存在確認と所有者確認を行うことを期待する。
		// もしリポジトリがそれらのチェックを行わない場合は、ここでfindByIdを呼んで確認処理を入れる必要がある。
		await deps.templateRepository.deleteById(input.id, input.userId);

		console.log(
			`DeleteTemplateUseCase: Template with id ${input.id} for user ${input.userId} deletion processed.`, // ★ ログにuserIdを追加
		);
	};
};
