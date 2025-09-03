import prisma from '../prisma.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { generateTokens, verifyRefreshToken } from '../utils/auth.js'
import logger from '../utils/logger.js'

interface LoginSuccess {
	success: true
	data: {
		accessToken: string
		refreshToken: string
		user: {
			id: string
			email: string
			name: string
			role: string
		}
	}
}

interface LoginError {
	success: false
	error: string
}

interface RefreshSuccess {
	success: true
	data: {
		accessToken: string
	}
}

interface RefreshError {
	success: false
	error: string
}

export class AuthService {
	async login(
		email: string,
		password: string
	): Promise<LoginSuccess | LoginError> {
		try {
			logger.info('Login attempt', { email })

			const user = await prisma.user.findUnique({
				where: { email },
			})

			if (!user || !(await comparePassword(password, user.password))) {
				logger.warn('Failed login attempt', {
					email,
					reason: 'Invalid credentials',
				})
				return { success: false, error: 'Invalid credentials' }
			}

			logger.info('Successful login', { userId: user.id, email: user.email })

			const { accessToken, refreshToken } = generateTokens({
				id: user.id,
				email: user.email,
			})

			return {
				success: true,
				data: {
					accessToken,
					refreshToken,
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role,
					},
				},
			}
		} catch (error) {
			return { success: false, error: 'Login failed' }
		}
	}

	async refreshToken(
		refreshToken: string
	): Promise<RefreshSuccess | RefreshError> {
		try {
			const decoded = verifyRefreshToken(refreshToken)

			const user = await prisma.user.findUnique({
				where: { id: decoded.id },
			})

			if (!user) {
				return { success: false, error: 'User not found' }
			}

			const { accessToken } = generateTokens({
				id: user.id,
				email: user.email,
			})

			return {
				success: true,
				data: { accessToken },
			}
		} catch (error) {
			return { success: false, error: 'Invalid refresh token' }
		}
	}
}
