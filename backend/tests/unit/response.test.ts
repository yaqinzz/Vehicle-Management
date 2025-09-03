import { describe, it, expect } from 'vitest'
import { ResponseHelper } from '../../src/utils/response'
import httpMocks from 'node-mocks-http'

describe('ResponseHelper', () => {
	it('sends success response', () => {
		const res = httpMocks.createResponse()
		ResponseHelper.success(res as any, 'ok', { hello: 'world' }, 201)
		expect(res.statusCode).toBe(201)
		const data = res._getJSONData()
		expect(data.success).toBe(true)
		expect(data.message).toBe('ok')
	})

	it('sends notFound', () => {
		const res = httpMocks.createResponse()
		ResponseHelper.notFound(res as any)
		expect(res.statusCode).toBe(404)
	})
})
