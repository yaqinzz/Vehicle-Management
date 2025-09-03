import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { vehicleApi } from '../services/vehicleService'
import type { Vehicle, VehicleFilters } from '../types'
import { Button } from '@radix-ui/themes'
import {
	Search,
	LogOut,
	Car,
	BarChart3,
	Users,
	Settings,
	Filter,
	List,
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
	const navigate = useNavigate()
	const { user, logout } = useAuthStore()
	const [filters, setFilters] = useState<VehicleFilters>({
		page: 1,
		limit: 10,
		search: '',
		status: undefined,
	})
	const [searchInput, setSearchInput] = useState('')

	const {
		data: vehiclesData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['vehicles', filters],
		queryFn: () => vehicleApi.getVehicles(filters),
		staleTime: 30000, // 30 seconds
	})

	const handleSearch = () => {
		setFilters(prev => ({
			...prev,
			search: searchInput.trim() || undefined,
			page: 1,
		}))
	}

	const handleStatusFilter = (
		status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE' | undefined
	) => {
		setFilters(prev => ({ ...prev, status, page: 1 }))
	}

	const handleVehicleClick = (vehicleId: string) => {
		navigate(`/vehicle/${vehicleId}`)
	}

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
				<div className='text-center bg-white p-8 rounded-xl shadow-lg'>
					<h3 className='text-lg font-medium text-gray-900 mb-2'>
						Error loading vehicles
					</h3>
					<p className='text-gray-600'>Please try refreshing the page</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			{/* Header */}
			<div className='bg-white shadow-lg border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-6'>
						<div className='flex items-center space-x-4'>
							<div className='p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg'>
								<Car size={24} className='text-white' />
							</div>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									Vehicle Management System
								</h1>
								<p className='text-sm text-gray-600 flex items-center space-x-2'>
									<Users size={14} />
									<span>Welcome back, {user?.email}</span>
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-4'>
							<div className='hidden md:flex items-center space-x-6 text-sm text-gray-600'>
								<div className='flex items-center space-x-2'>
									<BarChart3 size={16} className='text-indigo-500' />
									<span>Dashboard</span>
								</div>
							</div>
							<Button
								onClick={handleLogout}
								variant='soft'
								className='bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 transition-all'>
								<LogOut size={16} className='mr-2' />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='space-y-8'>
					{/* Stats Overview */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-gray-600'>
										Total Vehicles
									</p>
									<p className='text-3xl font-bold text-indigo-600'>
										{(vehiclesData?.success &&
											vehiclesData.data?.pagination?.total) ||
											0}
									</p>
								</div>
								<div className='p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg'>
									<Car size={24} className='text-white' />
								</div>
							</div>
						</div>
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-gray-600'>
										Active Vehicles
									</p>
									<p className='text-3xl font-bold text-emerald-600'>
										{(vehiclesData?.success &&
											vehiclesData.data?.vehicles?.filter(
												(v: Vehicle) => v.status === 'ACTIVE'
											).length) ||
											0}
									</p>
								</div>
								<div className='p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg'>
									<Settings size={24} className='text-white' />
								</div>
							</div>
						</div>
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-gray-600'>
										Total Pages
									</p>
									<p className='text-3xl font-bold text-purple-600'>
										{(vehiclesData?.success &&
											vehiclesData.data?.pagination?.totalPages) ||
											0}
									</p>
								</div>
								<div className='p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg'>
									<BarChart3 size={24} className='text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Controls */}
					<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
						<div className='flex items-center space-x-3 mb-6'>
							<div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg'>
								<Filter size={20} className='text-white' />
							</div>
							<h3 className='text-lg font-semibold text-gray-900'>
								Search & Filter Vehicles
							</h3>
						</div>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
							{/* Search Section */}
							<div className='space-y-4'>
								<h4 className='font-medium text-gray-900 flex items-center space-x-2'>
									<Search size={16} className='text-gray-600' />
									<span>Vehicle Search</span>
								</h4>
								<div className='flex space-x-3'>
									<div className='flex-1 relative'>
										<input
											type='text'
											placeholder='Search by vehicle name...'
											value={searchInput}
											onChange={e => setSearchInput(e.target.value)}
											onKeyPress={e => e.key === 'Enter' && handleSearch()}
											className='w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
										/>
										<Search
											size={18}
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
										/>
									</div>
									<Button
										onClick={handleSearch}
										className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl'>
										<Search size={16} className='mr-2' />
										Search
									</Button>
								</div>
							</div>

							{/* Status Filter Section */}
							<div className='space-y-4'>
								<h4 className='font-medium text-gray-900 flex items-center space-x-2'>
									<Filter size={16} className='text-gray-600' />
									<span>Filter by Status</span>
								</h4>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
									<Button
										variant={filters.status === undefined ? 'solid' : 'outline'}
										onClick={() => handleStatusFilter(undefined)}
										className={`transition-all ${
											filters.status === undefined
												? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
												: 'hover:bg-gray-50 border-gray-300'
										}`}>
										All
									</Button>
									<Button
										variant={filters.status === 'ACTIVE' ? 'solid' : 'outline'}
										onClick={() => handleStatusFilter('ACTIVE')}
										className={`transition-all ${
											filters.status === 'ACTIVE'
												? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
												: 'hover:bg-emerald-50 border-emerald-300 text-emerald-700'
										}`}>
										Active
									</Button>
									<Button
										variant={
											filters.status === 'MAINTENANCE' ? 'solid' : 'outline'
										}
										onClick={() => handleStatusFilter('MAINTENANCE')}
										className={`transition-all ${
											filters.status === 'MAINTENANCE'
												? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
												: 'hover:bg-amber-50 border-amber-300 text-amber-700'
										}`}>
										Maintenance
									</Button>
									<Button
										variant={
											filters.status === 'INACTIVE' ? 'solid' : 'outline'
										}
										onClick={() => handleStatusFilter('INACTIVE')}
										className={`transition-all ${
											filters.status === 'INACTIVE'
												? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
												: 'hover:bg-red-50 border-red-300 text-red-700'
										}`}>
										INACTIVE
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Vehicle Table */}
					<div className='bg-white rounded-xl shadow-lg border border-gray-100'>
						<div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg'>
									<List size={20} className='text-white' />
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Vehicle Directory
								</h3>
							</div>
						</div>

						{isLoading ? (
							<div className='p-12 text-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
								<p className='mt-4 text-gray-600 font-medium'>
									Loading vehicles...
								</p>
							</div>
						) : vehiclesData?.success &&
						  vehiclesData.data?.vehicles?.length > 0 ? (
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gradient-to-r from-gray-50 to-slate-100'>
										<tr>
											<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
												<div className='flex items-center space-x-2'>
													<Car size={14} />
													<span>Vehicle</span>
												</div>
											</th>
											<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
												<div className='flex items-center space-x-2'>
													<Settings size={14} />
													<span>Status</span>
												</div>
											</th>
											<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
												<div className='flex items-center space-x-2'>
													<BarChart3 size={14} />
													<span>Trips</span>
												</div>
											</th>
											<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
												Last Update
											</th>
											<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-100'>
										{vehiclesData.data.vehicles.map((vehicle: Vehicle) => (
											<tr
												key={vehicle.id}
												className='hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer'
												onClick={() => handleVehicleClick(vehicle.id)}>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center space-x-3'>
														<div className='p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg'>
															<Car size={18} className='text-blue-600' />
														</div>
														<div>
															<div className='text-sm font-semibold text-gray-900'>
																{vehicle.name}
															</div>
															<div className='text-xs text-gray-500 font-mono'>
																ID: {vehicle.id.substring(0, 8)}...
															</div>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<span
														className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
															vehicle.status === 'ACTIVE'
																? 'bg-green-100 text-green-800'
																: vehicle.status === 'MAINTENANCE'
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-red-100 text-red-800'
														}`}>
														{vehicle.status}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
													<div className='flex items-center space-x-2'>
														<div className='p-1.5 bg-blue-100 rounded'>
															<BarChart3 size={12} className='text-blue-600' />
														</div>
														<span className='font-medium'>
															{vehicle._count?.trips || 0}
														</span>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{vehicle.createdAt
														? format(new Date(vehicle.createdAt), 'dd MMM yyyy')
														: 'N/A'}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
													<Button
														variant='soft'
														onClick={e => {
															e.stopPropagation()
															handleVehicleClick(vehicle.id)
														}}
														className='bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all'>
														View Details
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className='p-12 text-center'>
								<div className='p-6 bg-gray-100 rounded-lg inline-block'>
									<Car size={48} className='text-gray-400 mx-auto mb-4' />
									<h4 className='text-lg font-medium text-gray-900 mb-2'>
										No vehicles found
									</h4>
									<p className='text-gray-600'>
										{filters.search || filters.status
											? 'Try adjusting your search or filter criteria'
											: 'No vehicles available in the system'}
									</p>
								</div>
							</div>
						)}

						{/* Pagination */}
						{vehiclesData?.success && vehiclesData.data?.pagination && (
							<div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
								<div className='flex items-center justify-between'>
									<div className='text-sm text-gray-700'>
										Showing{' '}
										{(vehiclesData.data.pagination.page - 1) *
											vehiclesData.data.pagination.limit +
											1}{' '}
										to{' '}
										{Math.min(
											vehiclesData.data.pagination.page *
												vehiclesData.data.pagination.limit,
											vehiclesData.data.pagination.total
										)}{' '}
										of {vehiclesData.data.pagination.total} vehicles
									</div>
									<div className='flex items-center space-x-3'>
										<Button
											variant='outline'
											disabled={!vehiclesData.data.pagination.hasPreviousPage}
											onClick={() =>
												setFilters(prev => ({
													...prev,
													page: prev.page - 1,
												}))
											}
											className='px-4 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'>
											Previous
										</Button>
										<span className='text-sm text-gray-700 bg-white px-3 py-2 rounded border'>
											Page {vehiclesData.data.pagination.page} of{' '}
											{vehiclesData.data.pagination.totalPages}
										</span>
										<Button
											variant='outline'
											disabled={!vehiclesData.data.pagination.hasNextPage}
											onClick={() =>
												setFilters(prev => ({
													...prev,
													page: prev.page + 1,
												}))
											}
											className='px-4 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'>
											Next
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
