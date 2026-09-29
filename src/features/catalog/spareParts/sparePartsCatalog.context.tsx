import { createContext, type ReactNode } from 'react';
import type { BrandService } from 'entities/brand';
import type { CatalogService } from 'entities/catalog';
import type { EngineVolumeService } from 'entities/engineVolume';
import type { GenerationService } from 'entities/generation';
import type { KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import type { SparePartService } from 'entities/sparePart';

export type SparePartsCatalogContextValue = {
	brandService: BrandService;
	catalogService: CatalogService;
	engineVolumeService: EngineVolumeService;
	generationService: GenerationService;
	kindSparePartService: KindSparePartService;
	modelService: ModelService;
	sparePartService: SparePartService;
};

export const SparePartsCatalogContext = createContext<SparePartsCatalogContextValue | null>(null);

type SparePartsCatalogInjectorProps = {
	value: SparePartsCatalogContextValue;
	children: ReactNode;
};

export const SparePartsCatalogInjector = ({ value, children }: SparePartsCatalogInjectorProps) => (
	<SparePartsCatalogContext.Provider value={value}>{children}</SparePartsCatalogContext.Provider>
);
