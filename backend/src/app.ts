import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { requestLogger, errorLogger } from './middlewares/logger.middleware.js'
import { generalLimiter } from './middlewares/rateLimiting.middleware.js'

const app = express()

// Request logging middleware (should be early in the chain)
app.use(requestLogger)

// Security middleware
app.use(helmet())
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
	})
)

// Rate limiting - general protection for all routes
app.use(generalLimiter)

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api', routes)
app.get('/', (req, res) => {
	res.send('Vehicle Management System API is running')
})

// Error logging middleware (should be before error handler)
app.use(errorLogger)

// Error handling
app.use(errorHandler)

export default app
