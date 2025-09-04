// Environment configuration for the frontend application

export const config = {
	// API Configuration
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

	// Application Configuration
	appName: import.meta.env.VITE_APP_NAME || 'Vehicle Management System',
	appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

	// Environment
	isDevelopment: import.meta.env.DEV,
	isProduction: import.meta.env.PROD,
	nodeEnv: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE,
} as const

// Type for configuration
export type Config = typeof config

// Validation function to ensure required environment variables are set
export function validateConfig(): void {
	const requiredVars = {
		VITE_API_BASE_URL: config.apiBaseUrl,
	}

	const missingVars = Object.entries(requiredVars)
		.filter(([, value]) => !value)
		.map(([key]) => key)

	if (missingVars.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingVars.join(', ')}`
		)
	}
}

// Call validation in development
if (config.isDevelopment) {
	try {
		validateConfig()
	} catch (error) {
		console.error('Environment configuration error:', error)
	}
}
