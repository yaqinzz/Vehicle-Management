import { Request, Response } from 'express'
import { createUserSchema, updateUserSchema } from '../utils/validation.js'
import { UsersService } from '../services/users.service.js'
import { ResponseHelper } from '../utils/response.js'
import { AuthenticatedUser } from '../types/user.interfaces.js'

interface AuthenticatedRequest extends Request {
	user?: AuthenticatedUser
}

const usersService = new UsersService()

export class UsersController {
	async getAll(req: Request, res: Response) {
		try {
			const users = await usersService.getAll()
			return ResponseHelper.success(res, 'Users retrieved successfully', users)
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to retrieve users', 500)
		}
	}

	async getById(req: AuthenticatedRequest, res: Response) {
		try {
			const { id } = req.params

			// Users can only access their own data, unless they're admin
			if (req.user?.role !== 'admin' && req.user?.id !== id) {
				return ResponseHelper.forbidden(
					res,
					'Access denied - insufficient permissions'
				)
			}

			const user = await usersService.getById(id)

			if (!user) {
				return ResponseHelper.notFound(res, 'User not found')
			}

			return ResponseHelper.success(res, 'User retrieved successfully', user)
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to retrieve user', 500)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const data = createUserSchema.parse(req.body)
			const user = await usersService.create(data)
			return ResponseHelper.success(res, 'User created successfully', user, 201)
		} catch (error) {
			return ResponseHelper.validationError(
				res,
				'Failed to create user - invalid data provided'
			)
		}
	}

	async update(req: AuthenticatedRequest, res: Response) {
		try {
			const { id } = req.params

			// Users can only update their own data, unless they're admin
			if (req.user?.role !== 'admin' && req.user?.id !== id) {
				return ResponseHelper.forbidden(
					res,
					'Access denied - insufficient permissions'
				)
			}

			const data = updateUserSchema.parse(req.body)
			const user = await usersService.update(id, data)

			if (!user) {
				return ResponseHelper.notFound(res, 'User not found')
			}

			return ResponseHelper.success(res, 'User updated successfully', user)
		} catch (error) {
			return ResponseHelper.validationError(
				res,
				'Failed to update user - invalid data provided'
			)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params
			const success = await usersService.delete(id)

			if (!success) {
				return ResponseHelper.notFound(res, 'User not found')
			}

			return ResponseHelper.success(res, 'User deleted successfully', {
				deletedUserId: id,
				deletedAt: new Date().toISOString(),
			})
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to delete user', 500)
		}
	}
}
