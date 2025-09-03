import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

// mock prisma and comparePassword inside auth service via vi.mock
vi.mock('../../src/prisma', () => ({
	default: {
		user: {
			findUnique: vi.fn(async ({ where }: any) => {
				if (where.email === 'a@b.com')
					return {
						id: 'u1',
						email: 'a@b.com',
						password: await (
							await import('../../src/utils/hash')
						).hashPassword('password'),
						name: 'A',
						role: 'user',
					}
				return null
			}),
		},
	},
}))

import app from '../../src/app'

describe('Auth routes', () => {
	it('POST /api/auth/login returns 200 on valid creds', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'a@b.com', password: 'password' })
		expect(res.status).toBe(200)
		expect(res.body.success).toBe(true)
		expect(res.headers['set-cookie']).toBeDefined()
	})

	it('POST /api/auth/login returns 400 on invalid payload', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'bad', password: 'pw' })
		expect(res.status).toBe(400)
	})
})
