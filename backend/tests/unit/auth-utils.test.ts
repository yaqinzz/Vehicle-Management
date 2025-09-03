import { describe, it, expect } from 'vitest'
import {
	generateTokens,
	verifyAccessToken,
	verifyRefreshToken,
} from '../../src/utils/auth'

describe('auth utils', () => {
	it('generates tokens and verifies them', () => {
		const payload = { id: 'u1', email: 'a@b.com' }
		const tokens = generateTokens(payload)
		expect(tokens.accessToken).toBeTruthy()
		const decoded = verifyAccessToken(tokens.accessToken)
		expect((decoded as any).email).toBe('a@b.com')
		const decodedRef = verifyRefreshToken(tokens.refreshToken)
		expect((decodedRef as any).id).toBe('u1')
	})
})
