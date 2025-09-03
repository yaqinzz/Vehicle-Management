import prisma from '../prisma.js'

export class VehiclesService {
	async getAll(options?: {
		page?: number
		limit?: number
		search?: string
		status?: string
	}) {
		const page = options?.page || 1
		const limit = options?.limit || 10
		const skip = (page - 1) * limit

		const where: any = {}

		// Add search filter
		if (options?.search) {
			where.name = {
				contains: options.search,
				mode: 'insensitive',
			}
		}

		// Add status filter
		if (options?.status) {
			where.status = options.status
		}

		// Get total count for pagination
		const total = await prisma.vehicle.count({ where })

		// Get vehicles with pagination
		const vehicles = await prisma.vehicle.findMany({
			where,
			select: {
				id: true,
				name: true,
				status: true,
				createdAt: true,
				_count: {
					select: { trips: true },
				},
			},
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		})

		const totalPages = Math.ceil(total / limit)

		return {
			vehicles,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		}
	}

	async getById(id: string) {
		return await prisma.vehicle.findUnique({
			where: { id },
			include: {
				trips: {
					select: {
						id: true,
						date: true,
						distance: true,
						duration: true,
						type: true,
					},
					orderBy: { date: 'desc' },
					take: 10, // Last 10 trips
				},
			},
		})
	}

	async getStatusByDate(vehicleId: string, date?: string) {
		const vehicle = await prisma.vehicle.findUnique({
			where: { id: vehicleId },
			select: {
				id: true,
				name: true,
				status: true,
			},
		})

		if (!vehicle) return null

		let trips: any[] = []
		if (date) {
			const startDate = new Date(date)
			const endDate = new Date(startDate)
			endDate.setDate(endDate.getDate() + 1)

			trips = await prisma.trip.findMany({
				where: {
					vehicleId,
					date: {
						gte: startDate,
						lt: endDate,
					},
				},
				select: {
					id: true,
					date: true,
					distance: true,
					duration: true,
					type: true,
				},
			})
		}

		return {
			vehicle,
			trips,
			totalTrips: trips.length,
			totalDistance: trips.reduce((sum, trip) => sum + trip.distance, 0),
			totalDuration: trips.reduce((sum, trip) => sum + trip.duration, 0),
		}
	}
}
