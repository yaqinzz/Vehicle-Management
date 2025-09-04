import app from './app.js'
import dotenv from 'dotenv'
import logger from './utils/logger.js'

dotenv.config()

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
	logger.info(`🚀 Server running on http://localhost:${PORT}`)
	logger.info(`📚 API Documentation: http://localhost:${PORT}/docs`)
	logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
	logger.info('👋 Gracefully shutting down...')
	process.exit(0)
})

process.on('SIGTERM', () => {
	logger.info('👋 Gracefully shutting down...')
	process.exit(0)
})

// Handle uncaught exceptions
process.on('uncaughtException', error => {
	logger.error('Uncaught Exception:', {
		error: {
			message: error.message,
			stack: error.stack,
		},
	})
	process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection:', {
		reason,
		promise,
	})
})
