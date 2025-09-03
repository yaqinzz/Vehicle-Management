import { Router } from 'express'
import { ReportsController } from '../controllers/reports.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { reportLimiter } from '../middlewares/rateLimiting.middleware.js'

const router = Router()
const reportsController = new ReportsController()

// Download trips report as Excel with rate limiting
router.get('/trips/download', authenticate, reportLimiter, (req, res) =>
	reportsController.downloadTrips(req, res)
)

// Get trips statistics
router.get('/trips/stats', authenticate, (req, res) =>
	reportsController.getStats(req, res)
)

export default router
