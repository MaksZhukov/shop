import { createContext, type ReactNode } from 'react';
import type { SparePartService } from 'entities/sparePart';

export type BenefitsContextValue = {
	sparePartService: SparePartService;
};

export const BenefitsContext = createContext<BenefitsContextValue | null>(null);

type BenefitsInjectorProps = {
	value: BenefitsContextValue;
	children: ReactNode;
};

export const BenefitsInjector = ({ value, children }: BenefitsInjectorProps) => (
	<BenefitsContext.Provider value={value}>{children}</BenefitsContext.Provider>
);
