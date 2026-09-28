import { createContext, type ReactNode } from 'react';
import type { DefaultPage } from 'entities/page';
import type { ReviewsStore } from './reviews.store';

export type ReviewsContextValue = {
	reviewsStore: ReviewsStore;
	page: DefaultPage;
};

export const ReviewsContext = createContext<ReviewsContextValue | null>(null);

type ReviewsInjectorProps = {
	value: ReviewsContextValue;
	children: ReactNode;
};

export const ReviewsInjector = ({ value, children }: ReviewsInjectorProps) => (
	<ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
);
