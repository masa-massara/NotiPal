// src/presentation/handlers/destinationHandler.ts
import { ErrorCode } from "@notipal/common";
import type { Destination } from "@notipal/common";
import type { Context } from "hono";
import { respondError, respondSuccess } from "../utils/apiResponder";

export const createDestinationHandlerFactory = (
	createDestinationUseCase: (
		input: Destination & { userId: string },
	) => Promise<Destination>,
) => {
	return async (c: Context) => {
		try {
			const userId = c.get("userId");
			const body = await c.req.json();
			const result = await createDestinationUseCase({ ...body, userId });
			return respondSuccess(
				c,
				result,
				"Destination created successfully.",
				201,
			);
		} catch (error: unknown) {
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				(error as Error).message,
			);
		}
	};
};

export const getDestinationByIdHandlerFactory = (
	getDestinationUseCase: (input: {
		id: string;
		userId: string;
	}) => Promise<Destination | null>,
) => {
	return async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			const result = await getDestinationUseCase({ id, userId });
			if (!result) return respondError(c, ErrorCode.NOT_FOUND);
			return respondSuccess(c, result);
		} catch (error: unknown) {
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				(error as Error).message,
			);
		}
	};
};

export const listDestinationsHandlerFactory = (
	listDestinationsUseCase: (input: { userId: string }) => Promise<
		Destination[]
	>,
) => {
	return async (c: Context) => {
		try {
			const userId = c.get("userId");
			const result = await listDestinationsUseCase({ userId });
			return respondSuccess(c, result);
		} catch (error: unknown) {
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				(error as Error).message,
			);
		}
	};
};

export const updateDestinationHandlerFactory = (
	updateDestinationUseCase: (
		input: Destination & { id: string; userId: string },
	) => Promise<Destination>,
) => {
	return async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			const body = await c.req.json();
			const result = await updateDestinationUseCase({ ...body, id, userId });
			return respondSuccess(c, result, "Destination updated successfully.");
		} catch (error: unknown) {
			if ((error as Error).message?.includes("not found")) {
				return respondError(c, ErrorCode.NOT_FOUND, (error as Error).message);
			}
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				(error as Error).message,
			);
		}
	};
};

export const deleteDestinationHandlerFactory = (
	deleteDestinationUseCase: (input: {
		id: string;
		userId: string;
	}) => Promise<void>,
) => {
	return async (c: Context) => {
		try {
			const userId = c.get("userId");
			const id = c.req.param("id");
			await deleteDestinationUseCase({ id, userId });
			return respondSuccess(c, null, "Destination deleted successfully.");
		} catch (error: unknown) {
			if ((error as Error).message?.includes("not found")) {
				return respondError(c, ErrorCode.NOT_FOUND, (error as Error).message);
			}
			return respondError(
				c,
				ErrorCode.INTERNAL_SERVER_ERROR,
				(error as Error).message,
			);
		}
	};
};
