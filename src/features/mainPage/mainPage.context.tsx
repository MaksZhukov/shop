import { createContext, type ReactNode } from 'react';
import type { ArticleService } from 'entities/article';
import type { BrandService } from 'entities/brand';
import type { CarOnPartsService } from 'entities/carOnParts';
import type { EngineVolumeService } from 'entities/engineVolume';
import type { GenerationService } from 'entities/generation';
import type { KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import type { SparePartService } from 'entities/sparePart';

export type MainPageContextValue = {
	articleService: ArticleService;
	brandService: BrandService;
	carOnPartsService: CarOnPartsService;
	engineVolumeService: EngineVolumeService;
	generationService: GenerationService;
	kindSparePartService: KindSparePartService;
	modelService: ModelService;
	sparePartService: SparePartService;
};

export const MainPageContext = createContext<MainPageContextValue | null>(null);

type MainPageInjectorProps = {
	value: MainPageContextValue;
	children: ReactNode;
};

export const MainPageInjector = ({ value, children }: MainPageInjectorProps) => (
	<MainPageContext.Provider value={value}>{children}</MainPageContext.Provider>
);
