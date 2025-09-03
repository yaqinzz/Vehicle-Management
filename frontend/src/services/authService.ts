import { apiClient } from '../lib/api'
import type {
	LoginRequest,
	LoginResponse,
	AuthError,
	StandardApiResponse,
} from '../types'

export const authApi = {
	// Login
	login: async (
		credentials: LoginRequest
	): Promise<LoginResponse | AuthError> => {
		try {
			const response = await apiClient.post<LoginResponse>(
				'/auth/login',
				credentials
			)
			return response.data
		} catch (error: unknown) {
			console.error('Login API error:', error)

			// Handle error response from backend
			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as { response?: { data?: AuthError } }
				if (axiosError.response?.data) {
					return axiosError.response.data
				}
			}

			// Handle network or other errors
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed'
			return {
				success: false,
				message: 'Network error occurred',
				error: errorMessage,
				timestamp: new Date().toISOString(),
			}
		}
	},

	// Refresh token
	refresh: async (): Promise<StandardApiResponse<{ refreshTime: string }>> => {
		const response = await apiClient.post('/auth/refresh')
		return response.data
	},

	// Logout
	logout: async (): Promise<StandardApiResponse<{ logoutTime: string }>> => {
		const response = await apiClient.post('/auth/logout')
		return response.data
	},
}
