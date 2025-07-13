import { ErrorCode } from "@notipal/common";
import type { Destination } from "@notipal/common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { InitializedUseCases } from "../../di";

export const createDestinationHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const body = await c.req.json();
		const result = await useCases.createDestinationUseCase({ ...body, userId });
		return c.json(result, 201);
	} catch (error: unknown) {
		throw new HTTPException(500, {
			message: (error as Error).message,
		});
	}
};

export const getDestinationByIdHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const result = await useCases.getDestinationUseCase({ id, userId });
		if (!result) {
			throw new HTTPException(404, {
				message: "Destination not found",
			});
		}
		return c.json(result, 200);
	} catch (error: unknown) {
		if (error instanceof HTTPException) {
			throw error;
		}
		throw new HTTPException(500, {
			message: (error as Error).message,
		});
	}
};

export const listDestinationsHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const result = await useCases.listDestinationsUseCase({ userId });
		return c.json({ success: true, data: result }, 200);
	} catch (error: unknown) {
		throw new HTTPException(500, {
			message: (error as Error).message,
		});
	}
};

export const updateDestinationHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const body = await c.req.json();
		const result = await useCases.updateDestinationUseCase({
			...body,
			id,
			userId,
		});
		return c.json(result, 200);
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

export const deleteDestinationHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		const id = c.req.param("id");
		await useCases.deleteDestinationUseCase({ id, userId });
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
