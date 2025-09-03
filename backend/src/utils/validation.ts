import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	name: z.string().min(1, 'Name is required'),
	role: z.string().optional().default('user'),
})

export const updateUserSchema = z.object({
	email: z.string().email('Invalid email format').optional(),
	name: z.string().min(1, 'Name is required').optional(),
	role: z.string().optional(),
})

export const vehicleQuerySchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
		.optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type VehicleQuery = z.infer<typeof vehicleQuerySchema>
