import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { vehicleApi } from '../services/vehicleService'
import { reportApi } from '../services/reportService'
import { Button } from '@radix-ui/themes'
import {
	ArrowLeft,
	Download,
	Calendar,
	Car,
	Gauge,
	MapPin,
	BarChart3,
	FileText,
	Clock,
} from 'lucide-react'
import { format } from 'date-fns'

export default function VehicleDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [showDateFilter, setShowDateFilter] = useState(false)

	// Report download states
	const [reportStartDate, setReportStartDate] = useState<string>(
		format(new Date(), 'yyyy-MM-dd')
	)
	const [reportEndDate, setReportEndDate] = useState<string>(
		format(new Date(), 'yyyy-MM-dd')
	)

	const { data: vehicleData, isLoading: vehicleLoading } = useQuery({
		queryKey: ['vehicle', id],
		queryFn: () => vehicleApi.getVehicle(id!),
		enabled: !!id,
	})

	const { data: statusData, isLoading: statusLoading } = useQuery({
		queryKey: ['vehicleStatus', id, selectedDate],
		queryFn: () => vehicleApi.getVehicleStatus(id!, selectedDate),
		enabled: !!id && !!selectedDate && showDateFilter,
	})

	const handleDownloadReport = async () => {
		if (!id) return

		try {
			// Use the report date range from the form inputs
			const reportParams = {
				startDate: reportStartDate || '2020-01-01', // Use form input or default to capture all data
				endDate: reportEndDate || format(new Date(), 'yyyy-MM-dd'), // Use form input or default to today
				vehicleId: id,
			}

			const blob = await reportApi.downloadTripReport(reportParams)

			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url

			// Create filename based on report date range
			let dateStr = ''
			if (reportStartDate || reportEndDate) {
				if (reportStartDate === reportEndDate) {
					dateStr = `-${reportStartDate}`
				} else {
					const start = reportStartDate || '2020-01-01'
					const end = reportEndDate || format(new Date(), 'yyyy-MM-dd')
					dateStr = `-${start}-to-${end}`
				}
			} else {
				dateStr = '-all'
			}
			link.download = `vehicle-${
				vehicleData?.success && vehicleData.data?.name
					? vehicleData.data.name.replace(/\s+/g, '-').toLowerCase()
					: 'unknown'
			}${dateStr}.xlsx`
			document.body.appendChild(link)
			link.click()

			window.URL.revokeObjectURL(url)
			document.body.removeChild(link)
		} catch (error) {
			console.error('Failed to download report:', error)
		}
	}

	if (vehicleLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
					<p className='mt-2 text-gray-600'>Loading vehicle details...</p>
				</div>
			</div>
		)
	}

	if (!vehicleData?.success || !vehicleData.data) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<h3 className='text-lg font-medium text-gray-900'>
						Vehicle not found
					</h3>
					<Button onClick={() => navigate('/dashboard')} className='mt-4'>
						Back to Dashboard
					</Button>
				</div>
			</div>
		)
	}

	const vehicle = vehicleData.data

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			{/* Header */}
			<div className='bg-white shadow-lg border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between py-6'>
						<div className='flex items-center space-x-4'>
							<Button
								variant='soft'
								onClick={() => navigate('/dashboard')}
								className='hover:shadow-md transition-shadow'>
								<ArrowLeft size={16} className='mr-2' />
								Back to Dashboard
							</Button>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'>
									<Car size={20} className='text-white' />
								</div>
								<div>
									<h1 className='text-2xl font-bold text-gray-900'>
										{vehicle.name}
									</h1>
									<p className='text-sm text-gray-500'>Vehicle Details</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Vehicle Info */}
					<div className='lg:col-span-1'>
						<div className='bg-white shadow-lg rounded-xl p-6 border border-gray-100'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg'>
									<Car size={20} className='text-white' />
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Vehicle Information
								</h3>
							</div>
							<div className='space-y-4'>
								<div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
									<label className='text-sm font-medium text-blue-700 flex items-center space-x-2'>
										<Car size={14} />
										<span>Vehicle Name</span>
									</label>
									<p className='text-lg font-semibold text-gray-900 mt-1'>
										{vehicle.name}
									</p>
								</div>
								<div className='p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100'>
									<label className='text-sm font-medium text-purple-700 flex items-center space-x-2'>
										<BarChart3 size={14} />
										<span>Vehicle ID</span>
									</label>
									<p className='text-sm text-gray-900 font-mono mt-1 bg-gray-100 px-2 py-1 rounded'>
										{vehicle.id}
									</p>
								</div>
								<div className='p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100'>
									<label className='text-sm font-medium text-green-700 flex items-center space-x-2'>
										<Clock size={14} />
										<span>Status</span>
									</label>
									<div className='flex items-center space-x-2 mt-1'>
										<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
										<span className='text-sm font-medium text-green-700'>
											Active
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Additional Vehicle Info */}
						<div className='bg-white shadow-lg rounded-xl p-6 border border-gray-100 mt-6'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg'>
									<FileText size={20} className='text-white' />
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Additional Information
								</h3>
							</div>
							<div className='space-y-4'>
								<div className='p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200'>
									<label className='text-sm font-medium text-gray-700 flex items-center space-x-2'>
										<MapPin size={14} />
										<span>Total Trips</span>
									</label>
									<p className='text-lg font-semibold text-gray-900 mt-1'>
										{vehicle.trips?.length || vehicle._count?.trips || 0} trips
									</p>
								</div>
								<div className='p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200'>
									<label className='text-sm font-medium text-indigo-700 flex items-center space-x-2'>
										<Clock size={14} />
										<span>Created At</span>
									</label>
									<p className='text-sm text-gray-900 mt-1'>
										{format(new Date(vehicle.createdAt), 'dd/MM/yyyy HH:mm')}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Status & Reports */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Vehicle Stats Overview */}
						<div className='bg-white shadow-lg rounded-xl p-6 border border-gray-100'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg'>
									<BarChart3 size={20} className='text-white' />
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Performance Overview
								</h3>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200'>
									<div className='flex items-center justify-between mb-2'>
										<div className='p-2 bg-blue-500 rounded-lg'>
											<MapPin size={16} className='text-white' />
										</div>
									</div>
									<h4 className='font-medium text-blue-900 mb-1'>
										Total Trips
									</h4>
									<p className='text-3xl font-bold text-blue-700'>
										{vehicleData?.success && vehicleData.data?.trips
											? vehicleData.data.trips.length
											: 0}
									</p>
									<p className='text-xs text-blue-600 mt-1'>
										completed journeys
									</p>
								</div>
								<div className='bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg border border-emerald-200'>
									<div className='flex items-center justify-between mb-2'>
										<div className='p-2 bg-emerald-500 rounded-lg'>
											<Gauge size={16} className='text-white' />
										</div>
									</div>
									<h4 className='font-medium text-emerald-900 mb-1'>
										Total Distance
									</h4>
									<p className='text-3xl font-bold text-emerald-700'>
										{vehicleData?.success && vehicleData.data?.trips
											? vehicleData.data.trips
													.reduce((sum, trip) => sum + trip.distance, 0)
													.toFixed(1)
											: 0}
									</p>
									<p className='text-xs text-emerald-600 mt-1'>
										kilometers traveled
									</p>
								</div>
								<div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200'>
									<div className='flex items-center justify-between mb-2'>
										<div className='p-2 bg-purple-500 rounded-lg'>
											<BarChart3 size={16} className='text-white' />
										</div>
									</div>
									<h4 className='font-medium text-purple-900 mb-1'>
										Average Distance
									</h4>
									<p className='text-3xl font-bold text-purple-700'>
										{vehicleData?.success &&
										vehicleData.data?.trips &&
										vehicleData.data.trips.length > 0
											? (
													vehicleData.data.trips.reduce(
														(sum, trip) => sum + trip.distance,
														0
													) / vehicleData.data.trips.length
											  ).toFixed(1)
											: 0}
									</p>
									<p className='text-xs text-purple-600 mt-1'>km per trip</p>
								</div>
							</div>
						</div>

						{/* Download Reports */}
						<div className='bg-white shadow-lg rounded-xl p-6 border border-gray-100'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg'>
									<Download size={20} className='text-white' />
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Export Reports
								</h3>
							</div>

							{/* This Vehicle Report with Date Range */}
							<div className='space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200'>
								<div className='flex items-center space-x-3'>
									<div className='p-2 bg-green-500 rounded-lg'>
										<FileText size={16} className='text-white' />
									</div>
									<div>
										<h4 className='font-semibold text-green-900'>
											Vehicle Trip Report
										</h4>
										<p className='text-sm text-green-700'>
											Export detailed report for{' '}
											{vehicleData?.success && vehicleData.data?.name}
										</p>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='text-sm font-semibold text-green-800 mb-2 flex items-center space-x-2'>
											<Calendar size={14} />
											<span>Start Date</span>
										</label>
										<input
											type='date'
											value={reportStartDate}
											onChange={e => setReportStartDate(e.target.value)}
											className='w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white shadow-sm'
										/>
									</div>
									<div>
										<label className='text-sm font-semibold text-green-800 mb-2 flex items-center space-x-2'>
											<Calendar size={14} />
											<span>End Date</span>
										</label>
										<input
											type='date'
											value={reportEndDate}
											onChange={e => setReportEndDate(e.target.value)}
											min={reportStartDate}
											className='w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white shadow-sm'
										/>
									</div>
								</div>
								<Button
									onClick={handleDownloadReport}
									className='w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
									<Download size={18} className='mr-2' />
									Export Trip Report
								</Button>
							</div>
						</div>

						{/* Date Filter (Optional) */}
						<div className='bg-white shadow-lg rounded-xl p-6 border border-gray-100'>
							<div className='flex items-center justify-between mb-6'>
								<div className='flex items-center space-x-3'>
									<div className='p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg'>
										<Calendar size={20} className='text-white' />
									</div>
									<h3 className='text-lg font-semibold text-gray-900'>
										Trip History Filter
									</h3>
								</div>
								<Button
									variant='outline'
									onClick={() => {
										setShowDateFilter(!showDateFilter)
										if (!showDateFilter) {
											setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
										} else {
											setSelectedDate('')
										}
									}}
									className='px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-700 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all'>
									{showDateFilter ? 'Show All Trips' : 'Filter by Date'}
								</Button>
							</div>

							{showDateFilter && (
								<div className='p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 mb-6'>
									<div className='flex items-center space-x-4 mb-4'>
										<div className='flex items-center space-x-2'>
											<div className='p-2 bg-amber-500 rounded-lg'>
												<Calendar size={16} className='text-white' />
											</div>
											<input
												type='date'
												value={selectedDate}
												onChange={e => setSelectedDate(e.target.value)}
												className='px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white'
											/>
										</div>
									</div>
								</div>
							)}

							{/* Daily Status (when date is selected) */}
							{showDateFilter && selectedDate && (
								<div className='mt-6'>
									<div className='flex items-center space-x-3 mb-4'>
										<div className='p-2 bg-blue-500 rounded-lg'>
											<MapPin size={16} className='text-white' />
										</div>
										<h4 className='font-semibold text-gray-900'>
											Trip Details for{' '}
											{format(new Date(selectedDate), 'dd MMMM yyyy')}
										</h4>
									</div>
									{statusLoading ? (
										<div className='text-center py-8'>
											<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
											<p className='mt-3 text-gray-600'>Loading trip data...</p>
										</div>
									) : statusData?.success && statusData.data ? (
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
												<div className='flex items-center space-x-2 mb-2'>
													<div className='p-1.5 bg-blue-500 rounded'>
														<Gauge size={12} className='text-white' />
													</div>
													<h5 className='font-semibold text-blue-900'>
														Daily Distance
													</h5>
												</div>
												<p className='text-2xl font-bold text-blue-700'>
													{statusData.data?.totalDistance || 0} km
												</p>
											</div>
											<div className='bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200'>
												<div className='flex items-center space-x-2 mb-2'>
													<div className='p-1.5 bg-emerald-500 rounded'>
														<MapPin size={12} className='text-white' />
													</div>
													<h5 className='font-semibold text-emerald-900'>
														Daily Trips
													</h5>
												</div>
												<p className='text-2xl font-bold text-emerald-700'>
													{statusData.data?.totalTrips || 0}
												</p>
											</div>
										</div>
									) : showDateFilter && selectedDate ? (
										<div className='text-center py-8'>
											<div className='p-4 bg-gray-100 rounded-lg inline-block'>
												<FileText
													size={32}
													className='text-gray-400 mx-auto mb-2'
												/>
												<p className='text-gray-600 font-medium'>
													No trips found for this date
												</p>
											</div>
										</div>
									) : null}
								</div>
							)}
						</div>

						{/* All Trip History */}
						{vehicleData?.success &&
							vehicleData.data?.trips &&
							vehicleData.data.trips.length > 0 && (
								<div className='bg-white shadow rounded-lg p-6'>
									<h3 className='text-lg font-medium text-gray-900 mb-4'>
										All Trips ({vehicleData.data.trips.length})
									</h3>
									<div className='space-y-3'>
										{vehicleData.data.trips.map((trip, index) => (
											<div
												key={trip.id || index}
												className='border-l-4 border-indigo-400 pl-4 py-3'>
												<div className='flex justify-between items-start'>
													<div>
														<p className='font-medium text-gray-900'>
															Trip #{index + 1}
														</p>
														<p className='text-sm text-gray-600'>
															Distance: {trip.distance} km | Duration:{' '}
															{trip.duration} min | Type: {trip.type}
														</p>
													</div>
													<span className='text-sm text-gray-500'>
														{trip.date && !isNaN(Date.parse(trip.date))
															? format(new Date(trip.date), 'dd/MM/yyyy')
															: 'Invalid date'}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	)
}
