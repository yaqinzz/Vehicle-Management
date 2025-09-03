import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../src/utils/hash'

describe('hash utils', () => {
	it('hashes and compares password', async () => {
		const pw = 'strongpassword'
		const hashed = await hashPassword(pw)
		expect(typeof hashed).toBe('string')
		const match = await comparePassword(pw, hashed)
		expect(match).toBe(true)
	})
})
