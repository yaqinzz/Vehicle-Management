import { Request, Response } from 'express'
import { vehicleQuerySchema } from '../utils/validation.js'
import { VehiclesService } from '../services/vehicles.service.js'
import { ResponseHelper } from '../utils/response.js'

const vehiclesService = new VehiclesService()

export class VehiclesController {
	async getAll(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 10
			const search = req.query.search as string
			const status = req.query.status as string

			const result = await vehiclesService.getAll({
				page,
				limit,
				search,
				status,
			})

			return ResponseHelper.success(res, 'Vehicles retrieved successfully', {
				vehicles: result.vehicles,
				pagination: result.pagination,
			})
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to retrieve vehicles', 500)
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const { id } = req.params
			const vehicle = await vehiclesService.getById(id)

			if (!vehicle) {
				return ResponseHelper.notFound(res, 'Vehicle not found')
			}

			return ResponseHelper.success(
				res,
				'Vehicle retrieved successfully',
				vehicle
			)
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to retrieve vehicle', 500)
		}
	}

	async getStatus(req: Request, res: Response) {
		try {
			const { vehicleId } = req.params
			const query = vehicleQuerySchema.parse(req.query)

			const result = await vehiclesService.getStatusByDate(
				vehicleId,
				query.date
			)

			if (!result) {
				return ResponseHelper.notFound(res, 'Vehicle status not found')
			}

			return ResponseHelper.success(
				res,
				'Vehicle status retrieved successfully',
				result
			)
		} catch (error) {
			return ResponseHelper.validationError(res, 'Invalid request parameters')
		}
	}
}
