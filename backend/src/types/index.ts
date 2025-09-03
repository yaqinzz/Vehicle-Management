// Export all interfaces from a single point
export * from './user.interfaces.js'
export * from './vehicle.interfaces.js'
export * from './trip.interfaces.js'
export * from './api.interfaces.js'

// Re-export common types for convenience
export type { Request, Response, NextFunction } from 'express'
