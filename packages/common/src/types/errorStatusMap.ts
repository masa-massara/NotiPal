import type { ErrorCode } from "./errorCodes";

export const errorStatusMap: Record<ErrorCode, number> = {
	VALIDATION_ERROR: 400, // 422 Unprocessable Entity もよく使われる
	UNAUTHENTICATED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
  NOTION_INTEGRATION_NOT_FOUND: 404,
  NOTION_API_ERROR: 502, // Bad Gateway
  TEMPLATE_NOT_FOUND: 404,
  DESTINATION_NOT_FOUND: 404,
}; 
