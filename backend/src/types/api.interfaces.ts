// Generic API response interfaces
export interface ApiSuccessResponse<T = any> {
	success: true
	data: T
	message?: string
}

export interface ApiErrorResponse {
	success: false
	error: string
	details?: any
}

export interface PaginationMeta {
	page: number
	limit: number
	total: number
	totalPages: number
	hasNext: boolean
	hasPrev: boolean
}

export interface PaginatedResponse<T = any> {
	success: true
	data: T[]
	meta: PaginationMeta
}

export interface PaginationQuery {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

// Health check response
export interface HealthCheckResponse {
	status: 'ok' | 'error'
	timestamp: string
	uptime: number
	database: 'connected' | 'disconnected'
	version: string
}

// File upload response
export interface FileUploadResponse {
	success: true
	data: {
		filename: string
		originalName: string
		size: number
		mimetype: string
		path: string
	}
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse
