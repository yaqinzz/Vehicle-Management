import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/auth.js'
import { AuthenticatedUser } from '../types/user.interfaces.js'
import prisma from '../prisma.js'

interface AuthenticatedRequest extends Request {
	user?: AuthenticatedUser
}

export const authenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token =
			req.cookies.accessToken ||
			req.headers.authorization?.replace('Bearer ', '')

		if (!token) {
			return res.status(401).json({ error: 'Access token required' })
		}

		const decoded = verifyAccessToken(token)

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true, role: true },
		})

		if (!user) {
			return res.status(401).json({ error: 'User not found' })
		}

		req.user = user
		next()
	} catch (error) {
		return res.status(401).json({ error: 'Invalid token' })
	}
}

export const authorize = (roles: string[]) => {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ error: 'Authentication required' })
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Insufficient permissions' })
		}

		next()
	}
}
