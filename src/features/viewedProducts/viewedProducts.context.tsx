import { createContext, type ReactNode } from 'react';
import type { SparePartService } from 'entities/sparePart';

export type ViewedProductsContextValue = {
	sparePartService: SparePartService;
};

export const ViewedProductsContext = createContext<ViewedProductsContextValue | null>(null);

type ViewedProductsInjectorProps = {
	value: ViewedProductsContextValue;
	children: ReactNode;
};

export const ViewedProductsInjector = ({ value, children }: ViewedProductsInjectorProps) => (
	<ViewedProductsContext.Provider value={value}>{children}</ViewedProductsContext.Provider>
);
