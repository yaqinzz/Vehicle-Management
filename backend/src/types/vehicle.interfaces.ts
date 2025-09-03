import { TripResponse } from './trip.interfaces.js'

// Vehicle interfaces
export interface BaseVehicle {
	id: string
	name: string
	status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
	createdAt: Date
	updatedAt: Date
}

export interface VehicleResponse {
	id: string
	name: string
	status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
	createdAt: Date
	updatedAt: Date
}

export interface CreateVehicleRequest {
	name: string
	status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
}

export interface UpdateVehicleRequest {
	name?: string
	status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
}

export interface VehicleWithTrips extends VehicleResponse {
	trips: TripResponse[]
}
