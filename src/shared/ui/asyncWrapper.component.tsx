import type { ReactNode } from 'react';

export type AsyncWrapperProps = {
	loading: boolean;
	fallback: ReactNode;
	error?: boolean;
	errorFallback?: ReactNode;
	children: ReactNode;
};

export const AsyncWrapper = ({ loading, fallback, error = false, errorFallback = null, children }: AsyncWrapperProps) => {
	if (loading) {
		return <>{fallback}</>;
	}

	if (error) {
		return <>{errorFallback}</>;
	}

	return <>{children}</>;
};
