import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Theme } from '@radix-ui/themes'
import AppRouter from './AppRouter'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
})

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Theme>
				<AppRouter />
			</Theme>
		</QueryClientProvider>
	)
}

export default App
