// Base API Response types
export interface BaseApiResponse {
	success: boolean
	message: string
	timestamp: string
}

export interface ApiSuccessResponse<T = unknown> extends BaseApiResponse {
	success: true
	data: T
}

export interface ApiErrorResponse extends BaseApiResponse {
	success: false
	error: string
}

export type StandardApiResponse<T = unknown> =
	| ApiSuccessResponse<T>
	| ApiErrorResponse

// User types
export interface User {
	id: string
	email: string
	name: string
	role: string
	createdAt: string
	updatedAt: string
}

export interface AuthUser {
	id: string
	email: string
	role: string
}

export interface LoginRequest {
	email: string
	password: string
}

export type LoginResponse = ApiSuccessResponse<{
	user: User
	accessToken: string
	refreshToken: string
	loginTime: string
}>

export type AuthError = ApiErrorResponse

// Vehicle types
export interface Vehicle {
	id: string
	name: string
	status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
	createdAt: string
	_count: {
		trips: number
	}
	// Optional fields that might exist in detailed responses
	licensePlate?: string
	brand?: string
	model?: string
	currentDriver?: string
	updatedAt?: string
}

export interface VehicleWithTrips extends Vehicle {
	trips: Trip[]
}

export interface VehicleStatus {
	totalDistance: number
	totalTrips: number
	activeHours: number
	status: string
}

// Trip types
export interface Trip {
	id: string
	vehicleId: string
	date: string
	startTime: string
	endTime?: string
	startLocation: string
	endLocation: string
	distance: number
	duration: number
	type: 'BUSINESS' | 'PERSONAL'
	createdAt: string
	updatedAt: string
}

export interface TripStats {
	totalTrips: number
	totalDistance: number
	totalDuration: number
	businessTrips: number
	personalTrips: number
	averageDistance: number
	averageDuration: number
}

// API response types
export interface ApiResponse<T> {
	success: boolean
	data: T
	message?: string
}

export interface PaginationInfo {
	page: number
	limit: number
	total: number
	totalPages: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

export interface VehiclesResponse {
	vehicles: Vehicle[]
	pagination: PaginationInfo
}

// Form types
export interface VehicleFilters {
	search?: string
	status?: Vehicle['status']
	page: number
	limit: number
}

export interface DateRangeFilter {
	startDate?: string
	endDate?: string
}
