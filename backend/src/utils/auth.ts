import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const generateTokens = (payload: { id: string; email: string }) => {
	const secret = process.env.JWT_SECRET || 'your-secret-key'
	const refreshSecret =
		process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'

	// Use numeric expiration times (in seconds)
	const accessToken = jwt.sign(payload, secret, {
		expiresIn: 15 * 60, // 15 minutes
	})

	const refreshToken = jwt.sign(payload, refreshSecret, {
		expiresIn: 7 * 24 * 60 * 60, // 7 days
	})

	return { accessToken, refreshToken }
}

export const verifyToken = (token: string, secret: string) => {
	try {
		return jwt.verify(token, secret) as { id: string; email: string }
	} catch (error) {
		throw new Error('Invalid token')
	}
}

export const verifyAccessToken = (token: string) => {
	const secret = process.env.JWT_SECRET || 'your-secret-key'
	return verifyToken(token, secret)
}

export const verifyRefreshToken = (token: string) => {
	const refreshSecret =
		process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
	return verifyToken(token, refreshSecret)
}

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12)
}

export const comparePassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword)
}
