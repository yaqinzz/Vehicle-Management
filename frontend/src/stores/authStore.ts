import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '../types'

interface AuthState {
	user: AuthUser | null
	token: string | null
	refreshToken: string | null
	isAuthenticated: boolean
	isLoading: boolean
}

interface AuthActions {
	setAuth: (user: AuthUser, token: string, refreshToken?: string) => void
	logout: () => void
	setLoading: (loading: boolean) => void
	clearAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		set => ({
			// State
			user: null,
			token: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,

			// Actions
			setAuth: (user, token, refreshToken) =>
				set({
					user,
					token,
					refreshToken,
					isAuthenticated: true,
					isLoading: false,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
					isLoading: false,
				}),

			setLoading: loading => set({ isLoading: loading }),

			clearAuth: () =>
				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
					isLoading: false,
				}),
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				user: state.user,
				token: state.token,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
)
