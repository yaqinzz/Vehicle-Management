import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authLimiter } from '../middlewares/rateLimiting.middleware.js'

const router = Router()
const authController = new AuthController()

// Login endpoint with strict rate limiting
router.post('/login', authLimiter, (req, res) => authController.login(req, res))

// Refresh token endpoint
router.post('/refresh', (req, res) => authController.refresh(req, res))

// Logout endpoint
router.post('/logout', (req, res) => authController.logout(req, res))

export default router
