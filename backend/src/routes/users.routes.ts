import { Router } from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { authenticate, authorize } from '../middlewares/auth.middleware.js'
import { adminLimiter } from '../middlewares/rateLimiting.middleware.js'

const router = Router()
const usersController = new UsersController()

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), (req, res) =>
	usersController.getAll(req, res)
)

// Get user by ID
router.get('/:id', authenticate, (req, res) =>
	usersController.getById(req, res)
)

// Create user (admin only) with admin rate limiting
router.post('/', authenticate, authorize(['admin']), adminLimiter, (req, res) =>
	usersController.create(req, res)
)

// Update user
router.put('/:id', authenticate, (req, res) => usersController.update(req, res))

// Delete user (admin only) with admin rate limiting
router.delete(
	'/:id',
	authenticate,
	authorize(['admin']),
	adminLimiter,
	(req, res) => usersController.delete(req, res)
)

export default router
