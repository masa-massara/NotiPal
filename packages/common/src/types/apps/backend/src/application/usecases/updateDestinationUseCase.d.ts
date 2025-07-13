import type { Destination as DestinationData, UpdateDestinationApiInput } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
export interface UpdateDestinationInput extends UpdateDestinationApiInput {
    id: string;
    userId: string;
}
export type UpdateDestinationOutput = DestinationData;
export declare const createUpdateDestinationUseCase: (dependencies: {
    destinationRepository: DestinationRepository;
}) => (input: UpdateDestinationInput) => Promise<UpdateDestinationOutput>;
