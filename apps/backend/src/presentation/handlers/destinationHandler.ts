import { ErrorCode } from "@notipal/common";
import type { Destination } from "@notipal/common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

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
			return c.json(result, 201);
		} catch (error: unknown) {
			throw new HTTPException(500, {
				message: (error as Error).message,
			});
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
			if (!result) {
				throw new HTTPException(404, {
					message: "Destination not found",
				});
			}
			return c.json(result);
		} catch (error: unknown) {
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message: (error as Error).message,
			});
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
			return c.json(result);
		} catch (error: unknown) {
			throw new HTTPException(500, {
				message: (error as Error).message,
			});
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
			return c.json(result);
		} catch (error: unknown) {
			if ((error as Error).message?.includes("not found")) {
				throw new HTTPException(404, {
					message: (error as Error).message,
				});
			}
			throw new HTTPException(500, {
				message: (error as Error).message,
			});
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
			return c.body(null, 204);
		} catch (error: unknown) {
			if ((error as Error).message?.includes("not found")) {
				throw new HTTPException(404, {
					message: (error as Error).message,
				});
			}
			throw new HTTPException(500, {
				message: (error as Error).message,
			});
		}
	};
};
