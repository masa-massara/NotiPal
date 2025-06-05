import { errorStatusMap } from "@notipal/common";
import type { ErrorCode } from "@notipal/common";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

/**
 * 成功時のレスポンスを生成します。
 * @param c Honoのコンテキスト
 * @param data クライアントに返すデータ
 * @param message オプショナルの成功メッセージ
 * @param statusCode HTTPステータスコード (デフォルト: 200)
 */
export const respondSuccess = <T>(
	c: Context,
	data: T,
	message?: string,
	statusCode: StatusCode = 200,
) => {
	c.status(statusCode);
	return c.json({
		success: true,
		data,
		message,
	});
};

/**
 * エラー時のレスポンスを生成します。
 * @param c Honoのコンテキスト
 * @param errorCode エラーコード
 * @param details オプショナルのエラー詳細
 * @param message オプショナルのエラーメッセージ
 */
export const respondError = (
	c: Context,
	errorCode: ErrorCode,
	details?: unknown,
	message?: string,
) => {
	const statusCode: StatusCode =
		(errorStatusMap[errorCode] as StatusCode) || 500;
	const defaultMessage = message || errorCode.replace(/_/g, " ").toLowerCase();
	c.status(statusCode);
	return c.json({
		success: false,
		error: {
			code: errorCode,
			details,
		},
		message: defaultMessage,
	});
};
