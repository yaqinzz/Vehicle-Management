import { Response } from 'express'

export interface ApiResponse<T = any> {
	success: boolean
	message: string
	data?: T
	error?: string
	timestamp: string
}

export class ResponseHelper {
	/**
	 * Send success response
	 */
	static success<T>(
		res: Response,
		message: string,
		data?: T,
		statusCode: number = 200
	): Response<ApiResponse<T>> {
		const response: ApiResponse<T> = {
			success: true,
			message,
			data,
			timestamp: new Date().toISOString(),
		}

		return res.status(statusCode).json(response)
	}

	/**
	 * Send error response
	 */
	static error(
		res: Response,
		message: string,
		statusCode: number = 500,
		error?: string
	): Response<ApiResponse> {
		const response: ApiResponse = {
			success: false,
			message,
			error: error || message,
			timestamp: new Date().toISOString(),
		}

		return res.status(statusCode).json(response)
	}

	/**
	 * Send validation error response
	 */
	static validationError(
		res: Response,
		message: string = 'Validation failed',
		errors?: any
	): Response<ApiResponse> {
		const response: ApiResponse = {
			success: false,
			message,
			error: errors,
			timestamp: new Date().toISOString(),
		}

		return res.status(400).json(response)
	}

	/**
	 * Send not found response
	 */
	static notFound(
		res: Response,
		message: string = 'Resource not found'
	): Response<ApiResponse> {
		const response: ApiResponse = {
			success: false,
			message,
			error: message,
			timestamp: new Date().toISOString(),
		}

		return res.status(404).json(response)
	}

	/**
	 * Send unauthorized response
	 */
	static unauthorized(
		res: Response,
		message: string = 'Unauthorized access'
	): Response<ApiResponse> {
		const response: ApiResponse = {
			success: false,
			message,
			error: message,
			timestamp: new Date().toISOString(),
		}

		return res.status(401).json(response)
	}

	/**
	 * Send forbidden response
	 */
	static forbidden(
		res: Response,
		message: string = 'Access forbidden'
	): Response<ApiResponse> {
		const response: ApiResponse = {
			success: false,
			message,
			error: message,
			timestamp: new Date().toISOString(),
		}

		return res.status(403).json(response)
	}
}
