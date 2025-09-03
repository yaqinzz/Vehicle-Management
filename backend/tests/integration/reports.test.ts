import { describe, it, vi, expect } from 'vitest'
import request from 'supertest'

// Mock reports service
vi.mock('../../src/services/reports.service', () => ({
	ReportsService: class {
		async generateTripsReport() {
			return Buffer.from('xls')
		}
		async getTripsStats() {
			return { total: 1 }
		}
	},
}))

// Mock authentication middleware to bypass token checks
vi.mock('../../src/middlewares/auth.middleware', () => ({
	authenticate: (req: any, res: any, next: any) => next(),
	authorize: (roles: string[]) => (req: any, res: any, next: any) => next(),
}))

import app from '../../src/app'

describe('Reports routes', () => {
	it('GET /api/reports/trips.xlsx returns xlsx content-type', async () => {
		const res = await request(app).get('/api/reports/trips/download')
		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toContain(
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
	})

	it('GET /api/reports/stats returns stats', async () => {
		const res = await request(app).get('/api/reports/trips/stats')
		expect(res.status).toBe(200)
		expect(res.body.success).toBe(true)
		expect(res.body.data.total).toBe(1)
	})
})
