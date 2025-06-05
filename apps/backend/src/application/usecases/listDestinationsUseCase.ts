// src/application/usecases/listDestinationsUseCase.ts
import type { Destination as DestinationData } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

// ユースケースの入力 (ユーザーID)
export interface ListDestinationsInput {
	// ★ Input DTOを定義
	userId: string;
}

// ユースケースの出力 (Destinationの配列)
export type ListDestinationsOutput = DestinationData[];

export const createListDestinationsUseCase = (dependencies: {
	destinationRepository: DestinationRepository;
}) => {
	const { destinationRepository } = dependencies;

	return async (
		input: ListDestinationsInput,
	): Promise<ListDestinationsOutput> => {
		console.log(
			`ListDestinationsUseCase: Attempting to execute findAll for user ${input.userId}...`,
		); // ★ ログにuserIdを追加
		const destinations = await destinationRepository.findAll(input.userId); // ★ findAllにuserIdを渡す
		console.log(
			`ListDestinationsUseCase: Found ${destinations.length} destinations for user ${input.userId}.`, // ★ ログにuserIdを追加
		);
		return destinations;
	};
};
