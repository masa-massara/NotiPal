import { z } from "zod";
import { ErrorCode } from "../types/errorCodes";
export declare const apiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodDiscriminatedUnion<"success", [z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}>, any>[k]; } : never, z.baseObjectInputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}>[k_1]; } : never>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodNativeEnum<typeof ErrorCode>;
        details: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        code: ErrorCode;
        details?: any;
    }, {
        code: ErrorCode;
        details?: any;
    }>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: ErrorCode;
        details?: any;
    };
    message?: string | undefined;
}, {
    success: false;
    error: {
        code: ErrorCode;
        details?: any;
    };
    message?: string | undefined;
}>]>;
export type ApiResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;
