import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/authService'
import * as Form from '@radix-ui/react-form'
import { Button } from '@radix-ui/themes'
import { Loader2, AlertCircle, Car, Mail, Lock, Shield } from 'lucide-react'

export default function Login() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const { setAuth } = useAuthStore()
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		const formData = new FormData(e.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		try {
			const response = await authApi.login({ email, password })

			if (response.success && response.data) {
				// Login was successful
				const authUser = {
					id: response.data.user.id,
					email: response.data.user.email,
					role: response.data.user.role,
				}
				// Save tokens in state management
				setAuth(authUser, response.data.accessToken, response.data.refreshToken)
				navigate('/dashboard')
			} else {
				// Login failed
				setError('error' in response ? response.error : response.message)
			}
		} catch (err) {
			console.error('Login error:', err)
			setError('Network error. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
			{/* Background Decorations */}
			<div className='absolute inset-0'>
				<div className='absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse'></div>
				<div className='absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000'></div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-500'></div>
			</div>

			<div className='relative max-w-md w-full space-y-8'>
				{/* Header */}
				<div className='text-center'>
					<div className='flex justify-center mb-6'>
						<div className='p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl'>
							<Car size={40} className='text-white' />
						</div>
					</div>
					<h2 className='text-4xl font-bold text-gray-900 mb-2'>
						Vehicle Management
					</h2>
					<div className='flex items-center justify-center space-x-2 mb-4'>
						<Shield size={16} className='text-indigo-600' />
						<p className='text-lg text-gray-600 font-medium'>
							Secure Login Portal
						</p>
					</div>
					<p className='text-sm text-gray-500'>
						Access your vehicle management dashboard
					</p>
				</div>

				{/* Login Form */}
				<div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8'>
					<Form.Root className='space-y-6' onSubmit={handleSubmit}>
						<div className='space-y-5'>
							<Form.Field name='email'>
								<div>
									<Form.Label className='block text-sm font-semibold text-gray-700 mb-2'>
										Email Address
									</Form.Label>
									<div className='relative'>
										<Form.Control asChild>
											<input
												id='email'
												name='email'
												type='email'
												autoComplete='email'
												required
												className='w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-500'
												placeholder='Enter your email address'
											/>
										</Form.Control>
										<Mail
											size={18}
											className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
										/>
									</div>
									<Form.Message
										className='text-sm text-red-600 mt-2 flex items-center space-x-1'
										match='valueMissing'>
										<AlertCircle size={14} />
										<span>Please enter your email</span>
									</Form.Message>
									<Form.Message
										className='text-sm text-red-600 mt-2 flex items-center space-x-1'
										match='typeMismatch'>
										<AlertCircle size={14} />
										<span>Please enter a valid email address</span>
									</Form.Message>
								</div>
							</Form.Field>

							<Form.Field name='password'>
								<div>
									<Form.Label className='block text-sm font-semibold text-gray-700 mb-2'>
										Password
									</Form.Label>
									<div className='relative'>
										<Form.Control asChild>
											<input
												id='password'
												name='password'
												type='password'
												autoComplete='current-password'
												required
												className='w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-500'
												placeholder='Enter your password'
											/>
										</Form.Control>
										<Lock
											size={18}
											className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
										/>
									</div>
									<Form.Message
										className='text-sm text-red-600 mt-2 flex items-center space-x-1'
										match='valueMissing'>
										<AlertCircle size={14} />
										<span>Please enter your password</span>
									</Form.Message>
								</div>
							</Form.Field>
						</div>

						{error && (
							<div className='bg-red-50 border border-red-200 rounded-xl p-4'>
								<div className='flex items-center space-x-3 text-red-700'>
									<AlertCircle size={18} className='flex-shrink-0' />
									<span className='text-sm font-medium'>{error}</span>
								</div>
							</div>
						)}

						<div>
							<Form.Submit asChild>
								<Button
									type='submit'
									disabled={isLoading}
									className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
									{isLoading ? (
										<div className='flex items-center justify-center space-x-2'>
											<Loader2 className='w-5 h-5 animate-spin' />
											<span>Signing In...</span>
										</div>
									) : (
										<div className='flex items-center justify-center space-x-2'>
											<Shield size={18} />
											<span>Sign In Securely</span>
										</div>
									)}
								</Button>
							</Form.Submit>
						</div>

						{/* Demo Credentials */}
						<div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4'>
							<div className='text-center'>
								<p className='text-sm font-semibold text-blue-800 mb-2'>
									Demo Credentials
								</p>
								<div className='space-y-1 text-xs text-blue-700'>
									<div className='flex items-center justify-center space-x-2'>
										<Mail size={12} />
										<span className='font-mono'>admin@example.com</span>
									</div>
									<div className='flex items-center justify-center space-x-2'>
										<Lock size={12} />
										<span className='font-mono'>admin123</span>
									</div>
								</div>
							</div>
						</div>
					</Form.Root>
				</div>

				{/* Footer */}
				<div className='text-center text-xs text-gray-500'>
					<p>© 2024 Vehicle Management System. All rights reserved.</p>
					<p className='mt-1'>Secure • Reliable • Modern</p>
				</div>
			</div>
		</div>
	)
}
