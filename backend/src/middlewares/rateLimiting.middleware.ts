import rateLimit from 'express-rate-limit'

// General API rate limiting - applies to all routes
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		error: 'Too many requests from this IP, please try again later.',
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // limit each IP to 10 login requests per windowMs
	message: {
		error: 'Too many login attempts, please try again later.',
	},
	skipSuccessfulRequests: true, // Don't count successful requests
})

// Rate limiting for report generation (heavier operations)
export const reportLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 20, // limit each IP to 20 report requests per 10 minutes
	message: {
		error: 'Too many report requests, please try again later.',
	},
})

// Rate limiting for user creation (admin operations)
export const adminLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 30, // limit each IP to 20 admin operations per hour
	message: {
		error: 'Too many admin operations, please try again later.',
	},
})
