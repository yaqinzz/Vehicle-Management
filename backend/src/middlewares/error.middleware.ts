import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.stack)

	// Zod validation errors
	if (err instanceof ZodError) {
		return res.status(400).json({
			error: 'Validation failed',
			details: err.issues,
		})
	}

	// Prisma errors
	if (err.code === 'P2002') {
		return res.status(409).json({
			error: 'Duplicate entry',
			message: 'A record with this value already exists',
		})
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Invalid token',
		})
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			error: 'Token expired',
		})
	}

	// Default error
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
	})
}
