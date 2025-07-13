// src/application/usecases/listDestinationsUseCase.ts
import type {
	Destination,
	Destination as DestinationData,
} from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

// ユースケースの入力 (ユーザーID)
export interface ListDestinationsInput {
	// ★ Input DTOを定義
	userId: string;
}

// ユースケースの出力 (Destinationの配列)
export type ListDestinationsOutput = DestinationData[];

export const createListDestinationsUseCase = (deps: {
	destinationRepository: DestinationRepository;
}) => {
	return async (input: { userId: string }): Promise<Destination[]> => {
		const destinations = await deps.destinationRepository.findAll(input.userId);
		return destinations;
	};
};
