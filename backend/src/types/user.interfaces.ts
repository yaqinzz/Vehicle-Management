// Base User interfaces
export interface BaseUser {
	id: string
	email: string
	name: string
	role: string
	createdAt: Date
	updatedAt: Date
}

// User interface for authentication (minimal data)
export interface AuthenticatedUser {
	id: string
	email: string
	role: string
}

// User interface for API responses (without sensitive data)
export interface UserResponse {
	id: string
	email: string
	name: string
	role: string
	createdAt: Date
	updatedAt: Date
}

// User interface for creation (with password)
export interface CreateUserRequest {
	email: string
	password: string
	name: string
	role: string
}

// User interface for updates (optional fields)
export interface UpdateUserRequest {
	email?: string
	password?: string
	name?: string
	role?: string
}

// Login request interface
export interface LoginRequest {
	email: string
	password: string
}

// JWT Token payload interface
export interface JWTPayload {
	id: string
	email: string
	iat?: number
	exp?: number
}

// Auth response interfaces
export interface LoginResponse {
	success: true
	data: {
		accessToken: string
		refreshToken: string
		user: UserResponse
	}
}

export interface AuthErrorResponse {
	success: false
	error: string
}

export interface RefreshTokenResponse {
	success: true
	data: {
		accessToken: string
	}
}

export type AuthResult = LoginResponse | AuthErrorResponse
export type RefreshResult = RefreshTokenResponse | AuthErrorResponse
