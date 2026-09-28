import type { BrandService } from 'entities/brand';
import type { CatalogService } from 'entities/catalog';
import type { EngineVolumeService } from 'entities/engineVolume';
import type { GenerationService } from 'entities/generation';
import type { KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import type { SparePartService } from 'entities/sparePart';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof BrandService
	| typeof CatalogService
	| typeof EngineVolumeService
	| typeof GenerationService
	| typeof KindSparePartService
	| typeof ModelService
	| typeof SparePartService
>();
