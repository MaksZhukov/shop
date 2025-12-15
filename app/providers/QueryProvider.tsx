import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useState } from 'react';

export const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 30 seconds - good default for most queries
						gcTime: 5 * 60 * 1000 // 5 minutes - keep unused queries in cache
					}
				}
			})
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
