import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { config } from './config'

// Create axios instance
export const apiClient = axios.create({
	baseURL: config.apiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	config => {
		const token = useAuthStore.getState().token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		// Don't try to refresh token for login requests
		if (originalRequest.url?.includes('/auth/login')) {
			return Promise.reject(error)
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			const { refreshToken, user } = useAuthStore.getState()

			if (!refreshToken) {
				// No refresh token available, logout
				useAuthStore.getState().logout()
				window.location.href = '/login'
				return Promise.reject(error)
			}

			try {
				// Try to refresh token using stored refresh token
				const refreshResponse = await apiClient.post('/auth/refresh', {
					refreshToken: refreshToken,
				})

				const newAccessToken = refreshResponse.data.data.accessToken

				// Update token in store
				if (user && newAccessToken) {
					useAuthStore.getState().setAuth(user, newAccessToken, refreshToken)
				}

				// Retry original request
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return apiClient(originalRequest)
			} catch (refreshError) {
				// Refresh failed, logout user
				console.error('Token refresh failed:', refreshError)
				useAuthStore.getState().logout()
				window.location.href = '/login'
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)
