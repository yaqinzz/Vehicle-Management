import { apiClient } from '../lib/api'

export const reportApi = {
	// Download trip report as Excel file
	downloadTripReport: async (filters: {
		startDate: string
		endDate: string
		vehicleId?: string
	}): Promise<Blob> => {
		const params = new URLSearchParams()
		params.append('startDate', filters.startDate)
		params.append('endDate', filters.endDate)

		if (filters.vehicleId) {
			params.append('vehicleId', filters.vehicleId)
		}

		const response = await apiClient.get(`/reports/trips/download?${params}`, {
			responseType: 'blob',
		})

		return response.data
	},
}
