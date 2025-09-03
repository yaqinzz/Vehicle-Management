// Trip interfaces
export interface BaseTrip {
	id: string
	vehicleId: string
	date: Date
	distance: number
	duration: number
	type: 'BUSINESS' | 'PERSONAL'
	createdAt: Date
	updatedAt: Date
}

export interface TripResponse {
	id: string
	vehicleId: string
	date: Date
	distance: number
	duration: number
	type: 'BUSINESS' | 'PERSONAL'
	createdAt: Date
	updatedAt: Date
}

export interface CreateTripRequest {
	vehicleId: string
	date: Date
	distance: number
	duration: number
	type: 'BUSINESS' | 'PERSONAL'
}

export interface UpdateTripRequest {
	vehicleId?: string
	date?: Date
	distance?: number
	duration?: number
	type?: 'BUSINESS' | 'PERSONAL'
}

export interface TripWithVehicle extends TripResponse {
	vehicle: {
		id: string
		name: string
		status: string
	}
}

// Trip statistics interfaces
export interface TripStats {
	totalTrips: number
	totalDistance: number
	totalDuration: number
	businessTrips: number
	personalTrips: number
	averageDistance: number
	averageDuration: number
}

// Excel export interfaces
export interface ExcelTripData {
	'Vehicle Name': string
	Date: string
	'Distance (km)': number
	'Duration (minutes)': number
	Type: string
	Status: string
}
