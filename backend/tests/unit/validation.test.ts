import { describe, it, expect } from 'vitest'
import { loginSchema, vehicleQuerySchema } from '../../src/utils/validation'

describe('validation schemas', () => {
	it('accepts valid login input', () => {
		const parsed = loginSchema.parse({ email: 'a@b.com', password: 'abcdef' })
		expect(parsed.email).toBe('a@b.com')
	})

	it('rejects invalid email', () => {
		expect(() =>
			loginSchema.parse({ email: 'not-an-email', password: 'abcdef' })
		).toThrow()
	})

	it('validates vehicle date format', () => {
		const ok = vehicleQuerySchema.parse({ date: '2025-09-04' })
		expect(ok.date).toBe('2025-09-04')
	})
})
