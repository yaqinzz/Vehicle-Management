import { apiClient } from '../lib/api'
import type {
	VehicleWithTrips,
	VehicleFilters,
	VehicleStatus,
	VehiclesResponse,
	StandardApiResponse,
} from '../types'

export const vehicleApi = {
	// Get all vehicles with pagination
	getVehicles: async (
		filters: VehicleFilters
	): Promise<StandardApiResponse<VehiclesResponse>> => {
		const params = new URLSearchParams()
		params.append('page', filters.page.toString())
		params.append('limit', filters.limit.toString())

		if (filters.search) params.append('search', filters.search)
		if (filters.status) params.append('status', filters.status)

		const response = await apiClient.get<StandardApiResponse<VehiclesResponse>>(
			`/vehicles?${params}`
		)
		return response.data
	},

	// Get vehicle by ID
	getVehicle: async (
		id: string
	): Promise<StandardApiResponse<VehicleWithTrips>> => {
		const response = await apiClient.get<StandardApiResponse<VehicleWithTrips>>(
			`/vehicles/${id}`
		)
		return response.data
	},

	// Get vehicle status by date
	getVehicleStatus: async (
		id: string,
		date: string
	): Promise<StandardApiResponse<VehicleStatus>> => {
		const response = await apiClient.get(`/vehicles/${id}/status?date=${date}`)
		return response.data
	},
}
