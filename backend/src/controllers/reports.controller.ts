import { Request, Response } from 'express'
import { ReportsService } from '../services/reports.service.js'
import { ResponseHelper } from '../utils/response.js'

const reportsService = new ReportsService()

export class ReportsController {
	async downloadTrips(req: Request, res: Response) {
		try {
			const { startDate, endDate, vehicleId } = req.query

			const buffer = await reportsService.generateTripsReport({
				startDate: startDate as string,
				endDate: endDate as string,
				vehicleId: vehicleId as string,
			})

			// Generate filename based on filters
			let filename = 'trips-report'
			if (vehicleId) {
				filename += `-vehicle-${(vehicleId as string).substring(0, 8)}`
			}
			if (startDate && endDate) {
				if (startDate === endDate) {
					filename += `-${startDate}`
				} else {
					filename += `-${startDate}-to-${endDate}`
				}
			} else if (startDate) {
				filename += `-from-${startDate}`
			} else if (endDate) {
				filename += `-until-${endDate}`
			}
			filename += '.xlsx'

			res.setHeader(
				'Content-Type',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			)
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

			res.send(buffer)
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to generate trips report', 500)
		}
	}

	async getStats(req: Request, res: Response) {
		try {
			const stats = await reportsService.getTripsStats()
			return ResponseHelper.success(
				res,
				'Statistics retrieved successfully',
				stats
			)
		} catch (error) {
			return ResponseHelper.error(res, 'Failed to retrieve statistics', 500)
		}
	}
}
