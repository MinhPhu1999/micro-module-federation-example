import { z } from 'zod';
export declare const createTodoSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
}>;
export declare const updateTodoSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    completed: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
}>, {
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
}>;
export type CreateTodoForm = z.infer<typeof createTodoSchema>;
export type UpdateTodoForm = z.infer<typeof updateTodoSchema>;
