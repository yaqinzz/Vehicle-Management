import { Router } from 'express'
import authRoutes from './auth.routes.js'
import usersRoutes from './users.routes.js'
import vehiclesRoutes from './vehicles.routes.js'
import reportsRoutes from './reports.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/vehicles', vehiclesRoutes)
router.use('/reports', reportsRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	})
})

export default router
