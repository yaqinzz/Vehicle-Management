import { Request, Response } from 'express'
import { loginSchema } from '../utils/validation.js'
import { AuthService } from '../services/auth.service.js'
import { ResponseHelper } from '../utils/response.js'
import logger from '../utils/logger.js'

const authService = new AuthService()

export class AuthController {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = loginSchema.parse(req.body)
			const result = await authService.login(email, password)

			if (!result.success) {
				return ResponseHelper.unauthorized(res, `Login failed: ${result.error}`)
			}

			if (!result.data) {
				return ResponseHelper.error(res, 'Authentication process failed', 500)
			}

			// Set HTTP-only cookies
			res.cookie('accessToken', result.data.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			})

			res.cookie('refreshToken', result.data.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})

			return ResponseHelper.success(
				res,
				'User logged in successfully',
				{
					user: result.data.user,
					accessToken: result.data.accessToken,
					refreshToken: result.data.refreshToken,
					loginTime: new Date().toISOString(),
				},
				200
			)
		} catch (error) {
			logger.error('Login error:', error)
			return ResponseHelper.validationError(
				res,
				'Invalid login credentials provided'
			)
		}
	}

	async refresh(req: Request, res: Response) {
		try {
			// Try to get refresh token from body first, then fallback to cookies
			let refreshToken = req.body.refreshToken || req.cookies.refreshToken

			if (!refreshToken) {
				return ResponseHelper.unauthorized(
					res,
					'Refresh token is required for authentication'
				)
			}

			const result = await authService.refreshToken(refreshToken)

			if (!result.success) {
				return ResponseHelper.unauthorized(
					res,
					`Token refresh failed: ${result.error}`
				)
			}

			if (!result.data) {
				return ResponseHelper.error(res, 'Token refresh process failed', 500)
			}

			// Set HTTP-only cookie for backward compatibility
			res.cookie('accessToken', result.data.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000,
			})

			return ResponseHelper.success(
				res,
				'Access token refreshed successfully',
				{
					accessToken: result.data.accessToken,
					refreshTime: new Date().toISOString(),
				}
			)
		} catch (error) {
			logger.error('Token refresh error:', error)
			return ResponseHelper.error(
				res,
				'Internal server error during token refresh',
				500
			)
		}
	}

	async logout(req: Request, res: Response) {
		try {
			res.clearCookie('accessToken')
			res.clearCookie('refreshToken')

			return ResponseHelper.success(res, 'User logged out successfully', {
				logoutTime: new Date().toISOString(),
			})
		} catch (error) {
			logger.error('Logout error:', error)
			return ResponseHelper.error(
				res,
				'Error occurred during logout process',
				500
			)
		}
	}
}
