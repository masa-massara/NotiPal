import { OpenAPIHono } from "@hono/zod-openapi";

import type { InitializedUseCases } from "../../di";
import {
	createDestinationHandlerFactory,
	deleteDestinationHandlerFactory,
	getDestinationByIdHandlerFactory,
	listDestinationsHandlerFactory,
	updateDestinationHandlerFactory,
} from "../handlers/destinationHandler";

export const createDestinationRoutes = (useCases: InitializedUseCases) => {
	const destinationRoutes = new OpenAPIHono<{
		Variables: { userId: string };
	}>()
		.get("/", listDestinationsHandlerFactory(useCases.listDestinationsUseCase))
		.post(
			"/",
			createDestinationHandlerFactory(useCases.createDestinationUseCase),
		)
		.get(
			"/:id",
			getDestinationByIdHandlerFactory(useCases.getDestinationUseCase),
		)
		.put(
			"/:id",
			updateDestinationHandlerFactory(useCases.updateDestinationUseCase),
		)
		.delete(
			"/:id",
			deleteDestinationHandlerFactory(useCases.deleteDestinationUseCase),
		);

	return destinationRoutes;
};
