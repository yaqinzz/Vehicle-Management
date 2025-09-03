import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import VehicleDetail from './components/VehicleDetail'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuthStore()

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />
	}

	return <>{children}</>
}

// Public Route (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuthStore()

	if (isAuthenticated) {
		return <Navigate to='/dashboard' replace />
	}

	return <>{children}</>
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to='/dashboard' replace />,
	},
	{
		path: '/login',
		element: (
			<PublicRoute>
				<Login />
			</PublicRoute>
		),
	},
	{
		path: '/dashboard',
		element: (
			<ProtectedRoute>
				<Dashboard />
			</ProtectedRoute>
		),
	},
	{
		path: '/vehicle/:id',
		element: (
			<ProtectedRoute>
				<VehicleDetail />
			</ProtectedRoute>
		),
	},
	{
		path: '*',
		element: <Navigate to='/dashboard' replace />,
	},
])

export default function AppRouter() {
	return <RouterProvider router={router} />
}
