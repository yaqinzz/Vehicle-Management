import { Router } from 'express'
import { VehiclesController } from '../controllers/vehicles.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()
const vehiclesController = new VehiclesController()

// Get all vehicles
router.get('/', authenticate, (req, res) => vehiclesController.getAll(req, res))

// Get vehicle status by ID and date
router.get('/:vehicleId/status', authenticate, (req, res) =>
	vehiclesController.getStatus(req, res)
)

// Get vehicle details by ID
router.get('/:id', authenticate, (req, res) =>
	vehiclesController.getById(req, res)
)

export default router
