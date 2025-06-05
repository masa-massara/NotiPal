// src/application/usecases/getDestinationUseCase.ts
import type { Destination as DestinationData } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

export interface GetDestinationInput {
	id: string;
	userId: string;
}

export type GetDestinationOutput = DestinationData | null;

export const createGetDestinationUseCase = (dependencies: {
	destinationRepository: DestinationRepository;
}) => {
	const { destinationRepository } = dependencies;

	return async (input: GetDestinationInput): Promise<GetDestinationOutput> => {
		const destination = await destinationRepository.findById(
			input.id,
			input.userId,
		);
		return destination;
	};
};
