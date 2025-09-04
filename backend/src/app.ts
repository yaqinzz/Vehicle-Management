import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { requestLogger, errorLogger } from './middlewares/logger.middleware.js'

// Swagger / OpenAPI
import fs from 'fs'
import yaml from 'js-yaml'
import swaggerUi, { type JsonObject } from 'swagger-ui-express'

const app = express()

// Trust proxy - important for security behind reverse proxy
app.set('trust proxy', 1)

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

app.use(express.json())
app.use(cookieParser())

// Routes
// Serve API docs from /docs (OpenAPI/Swagger)
try {
	const openapiPath = new URL('../openapi.yaml', import.meta.url)
	const openapiContent = fs.readFileSync(openapiPath, 'utf8')
	const openapiDocument = yaml.load(openapiContent) as JsonObject
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument))
} catch (err) {
	// If docs fail to load, don't crash the server; log and continue
	// eslint-disable-next-line no-console
	console.warn(
		'⚠️  Could not load OpenAPI docs:',
		err && (err as Error).message ? (err as Error).message : err
	)
}

app.use('/api', routes)
app.get('/', (req, res) => {
	res.send('Vehicle Management System API is running')
})

// Error logging middleware (should be before error handler)
app.use(errorLogger)

// Error handling
app.use(errorHandler)

export default app
