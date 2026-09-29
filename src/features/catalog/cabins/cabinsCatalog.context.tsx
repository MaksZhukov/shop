import { createContext, type ReactNode } from 'react';
import type { BrandService } from 'entities/brand';
import type { CabinService } from 'entities/cabin';
import type { GenerationService } from 'entities/generation';
import type { KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';

export type CabinsCatalogContextValue = {
	brandService: BrandService;
	cabinService: CabinService;
	generationService: GenerationService;
	kindSparePartService: KindSparePartService;
	modelService: ModelService;
};

export const CabinsCatalogContext = createContext<CabinsCatalogContextValue | null>(null);

type CabinsCatalogInjectorProps = {
	value: CabinsCatalogContextValue;
	children: ReactNode;
};

export const CabinsCatalogInjector = ({ value, children }: CabinsCatalogInjectorProps) => (
	<CabinsCatalogContext.Provider value={value}>{children}</CabinsCatalogContext.Provider>
);
