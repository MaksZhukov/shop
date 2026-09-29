import { createContext, type ReactNode } from 'react';
import type { TireService } from 'entities/tire';
import type { TireBrandService } from 'entities/tireBrand';
import type { TireDiameterService } from 'entities/tireDiameter';
import type { TireHeightService } from 'entities/tireHeight';
import type { TireWidthService } from 'entities/tireWidth';

export type TiresCatalogContextValue = {
	tireService: TireService;
	tireBrandService: TireBrandService;
	tireDiameterService: TireDiameterService;
	tireHeightService: TireHeightService;
	tireWidthService: TireWidthService;
};

export const TiresCatalogContext = createContext<TiresCatalogContextValue | null>(null);

type TiresCatalogInjectorProps = {
	value: TiresCatalogContextValue;
	children: ReactNode;
};

export const TiresCatalogInjector = ({ value, children }: TiresCatalogInjectorProps) => (
	<TiresCatalogContext.Provider value={value}>{children}</TiresCatalogContext.Provider>
);
