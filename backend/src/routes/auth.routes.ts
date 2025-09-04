import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const router = Router()
const authController = new AuthController()

// Login endpoint
router.post('/login', (req, res) => authController.login(req, res))

// Refresh token endpoint
router.post('/refresh', (req, res) => authController.refresh(req, res))

// Logout endpoint
router.post('/logout', (req, res) => authController.logout(req, res))

export default router
