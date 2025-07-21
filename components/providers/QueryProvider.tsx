import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useState } from 'react';

export const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 6000
					}
				}
			})
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
