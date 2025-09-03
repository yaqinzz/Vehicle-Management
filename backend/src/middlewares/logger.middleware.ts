import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js'

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = Date.now()

	// Log request details
	logger.info('HTTP Request', {
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
		userAgent: req.get('User-Agent'),
		timestamp: new Date().toISOString(),
	})

	// Listen for response finish event to log response details
	res.on('finish', () => {
		const duration = Date.now() - start
		const logData = {
			method: req.method,
			url: req.originalUrl,
			statusCode: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
			timestamp: new Date().toISOString(),
		}

		// Choose appropriate log level based on status code
		if (res.statusCode >= 500) {
			logger.error('HTTP Response', logData)
		} else if (res.statusCode >= 400) {
			logger.warn('HTTP Response', logData)
		} else {
			logger.info('HTTP Response', logData)
		}
	})

	next()
}

export const errorLogger = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error('HTTP Error', {
		error: {
			message: error.message,
			stack: error.stack,
			name: error.name,
		},
		request: {
			method: req.method,
			url: req.originalUrl,
			ip: req.ip,
			userAgent: req.get('User-Agent'),
		},
		timestamp: new Date().toISOString(),
	})

	next(error)
}
