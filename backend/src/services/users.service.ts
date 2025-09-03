import prisma from '../prisma.js'
import { hashPassword } from '../utils/hash.js'

export class UsersService {
	async getAll() {
		return await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}

	async getById(id: string) {
		return await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}

	async create(data: {
		email: string
		password: string
		name: string
		role?: string
	}) {
		const hashedPassword = await hashPassword(data.password)

		return await prisma.user.create({
			data: {
				...data,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
			},
		})
	}

	async update(
		id: string,
		data: { email?: string; name?: string; role?: string }
	) {
		return await prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				updatedAt: true,
			},
		})
	}

	async delete(id: string) {
		try {
			await prisma.user.delete({ where: { id } })
			return true
		} catch {
			return false
		}
	}
}
