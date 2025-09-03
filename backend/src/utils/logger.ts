import winston from 'winston'

// Define custom log format
const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss',
	}),
	winston.format.errors({ stack: true }),
	winston.format.json()
)

// Create logger instance
const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: logFormat,
	defaultMeta: { service: 'backend-api' },
	transports: [
		// Write all logs with importance level of `error` or less to `logs/error.log`
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
		// Write all logs with importance level of `info` or less to `logs/combined.log`
		new winston.transports.File({
			filename: 'logs/combined.log',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
	],
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	)
}

export default logger
