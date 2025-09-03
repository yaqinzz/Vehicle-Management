import ExcelJS from 'exceljs'
import prisma from '../prisma.js'

export interface TripReportFilters {
	startDate?: string
	endDate?: string
	vehicleId?: string
}

export class ReportsService {
	async generateTripsReport(filters: TripReportFilters = {}): Promise<any> {
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Trips Report')

		// Header
		worksheet.columns = [
			{ header: 'Trip ID', key: 'id', width: 36 },
			{ header: 'Vehicle Name', key: 'vehicleName', width: 20 },
			{ header: 'Date', key: 'date', width: 15 },
			{ header: 'Distance (km)', key: 'distance', width: 15 },
			{ header: 'Duration (min)', key: 'duration', width: 15 },
			{ header: 'Type', key: 'type', width: 12 },
		]

		// Build where clause based on filters
		const whereClause: any = {}

		if (filters.vehicleId) {
			whereClause.vehicleId = filters.vehicleId
		}

		if (filters.startDate || filters.endDate) {
			whereClause.date = {}
			if (filters.startDate) {
				whereClause.date.gte = new Date(filters.startDate)
			}
			if (filters.endDate) {
				whereClause.date.lte = new Date(filters.endDate + 'T23:59:59.999Z')
			}
		}

		// Get data with filters
		const trips = await prisma.trip.findMany({
			where: whereClause,
			include: {
				vehicle: {
					select: {
						name: true,
					},
				},
			},
			orderBy: { date: 'desc' },
		})

		// Add data rows
		trips.forEach(trip => {
			worksheet.addRow({
				id: trip.id,
				vehicleName: trip.vehicle.name,
				date: trip.date.toISOString().split('T')[0],
				distance: trip.distance,
				duration: trip.duration,
				type: trip.type,
			})
		})

		// Style header
		worksheet.getRow(1).font = { bold: true }
		worksheet.getRow(1).fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FFE0E0E0' },
		}

		// Add summary row if filtered by vehicle
		if (filters.vehicleId && trips.length > 0) {
			worksheet.addRow({})
			const summaryRow = worksheet.addRow({
				id: '',
				vehicleName: 'TOTAL:',
				date: '',
				distance: trips.reduce((sum, trip) => sum + trip.distance, 0),
				duration: trips.reduce((sum, trip) => sum + trip.duration, 0),
				type: `${trips.length} trips`,
			})
			summaryRow.font = { bold: true }
			summaryRow.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFF0F0F0' },
			}
		}

		// Generate buffer
		return await workbook.xlsx.writeBuffer()
	}

	async getTripsStats() {
		const [totalTrips, totalDistance, totalDuration, vehicleStats] =
			await Promise.all([
				prisma.trip.count(),
				prisma.trip.aggregate({ _sum: { distance: true } }),
				prisma.trip.aggregate({ _sum: { duration: true } }),
				prisma.trip.groupBy({
					by: ['vehicleId'],
					_count: { id: true },
					_sum: { distance: true, duration: true },
					orderBy: { _count: { id: 'desc' } },
				}),
			])

		const vehicleDetails = await prisma.vehicle.findMany({
			where: {
				id: { in: vehicleStats.map(v => v.vehicleId) },
			},
			select: { id: true, name: true },
		})

		const enrichedVehicleStats = vehicleStats.map(stat => {
			const vehicle = vehicleDetails.find(v => v.id === stat.vehicleId)
			return {
				vehicleId: stat.vehicleId,
				vehicleName: vehicle?.name || 'Unknown',
				totalTrips: stat._count.id,
				totalDistance: stat._sum.distance || 0,
				totalDuration: stat._sum.duration || 0,
			}
		})

		return {
			totalTrips,
			totalDistance: totalDistance._sum.distance || 0,
			totalDuration: totalDuration._sum.duration || 0,
			vehicleStats: enrichedVehicleStats,
		}
	}
}
