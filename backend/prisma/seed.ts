import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../dist/utils/auth.js'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Starting seeding process...')

	// Clear existing data
	console.log('🗑️  Clearing existing data...')
	await prisma.trip.deleteMany({})
	await prisma.vehicle.deleteMany({})
	await prisma.user.deleteMany({})

	// Hash passwords
	const adminHashedPassword = await hashPassword('admin123')
	const userHashedPassword = await hashPassword('user123')

	// Seed users with hashed passwords
	console.log('👤 Creating users...')
	await prisma.user.createMany({
		data: [
			{
				email: 'admin@example.com',
				password: adminHashedPassword,
				name: 'Admin User',
				role: 'admin',
			},
			{
				email: 'user@example.com',
				password: userHashedPassword,
				name: 'Regular User',
				role: 'user',
			},
		],
	})

	// Seed vehicles
	console.log('🚗 Creating vehicles...')
	const vehicle1 = await prisma.vehicle.create({
		data: { name: 'Toyota Avanza', status: 'ACTIVE' },
	})

	const vehicle2 = await prisma.vehicle.create({
		data: { name: 'Honda Civic', status: 'MAINTENANCE' },
	})

	const vehicle3 = await prisma.vehicle.create({
		data: { name: 'Suzuki Ertiga', status: 'ACTIVE' },
	})

	// Seed trips
	console.log('🛣️  Creating trips...')
	await prisma.trip.createMany({
		data: [
			// September 1st trips
			{
				vehicleId: vehicle1.id,
				date: new Date('2025-09-01'),
				distance: 120.5,
				duration: 90,
				type: 'BUSINESS',
			},
			{
				vehicleId: vehicle3.id,
				date: new Date('2025-09-01'),
				distance: 95.0,
				duration: 75,
				type: 'PERSONAL',
			},

			// September 2nd trips
			{
				vehicleId: vehicle2.id,
				date: new Date('2025-09-02'),
				distance: 220.0,
				duration: 150,
				type: 'PERSONAL',
			},
			{
				vehicleId: vehicle1.id,
				date: new Date('2025-09-02'),
				distance: 155.2,
				duration: 110,
				type: 'BUSINESS',
			},

			// September 3rd trips - multiple trips for testing
			{
				vehicleId: vehicle3.id,
				date: new Date('2025-09-03'),
				distance: 85.3,
				duration: 60,
				type: 'BUSINESS',
			},
			{
				vehicleId: vehicle1.id,
				date: new Date('2025-09-03'),
				distance: 67.8,
				duration: 45,
				type: 'BUSINESS',
			},
			{
				vehicleId: vehicle2.id,
				date: new Date('2025-09-03'),
				distance: 134.5,
				duration: 95,
				type: 'PERSONAL',
			},

			// August 30th trip
			{
				vehicleId: vehicle1.id,
				date: new Date('2025-08-30'),
				distance: 45.2,
				duration: 30,
				type: 'PERSONAL',
			},
		],
	})

	console.log('✅ Seeding completed successfully!')
}

main()
	.then(() => {
		console.log('🎉 All data seeded successfully!')
		console.log('\n📋 Test Accounts:')
		console.log('Admin: admin@example.com / admin123')
		console.log('User:  user@example.com / user123')
	})
	.catch(e => {
		console.error('❌ Error during seeding:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
