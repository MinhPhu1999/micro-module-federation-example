import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.required')
    .max(160, 'validation.title_max'),
  description: z
    .string()
    .max(2000, 'validation.description_max')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().max(1000, 'validation.tags_max').optional(),
  due_at: z.string().optional(),
})

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.required')
    .max(160, 'validation.title_max')
    .optional(),
  description: z
    .string()
    .max(2000, 'validation.description_max')
    .optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().max(1000, 'validation.tags_max').optional(),
  due_at: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'validation.at_least_one_field' }
)

export type CreateTodoForm = z.infer<typeof createTodoSchema>
export type UpdateTodoForm = z.infer<typeof updateTodoSchema>
