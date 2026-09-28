import type { BrandService } from 'entities/brand';
import type { CabinService } from 'entities/cabin';
import type { GenerationService } from 'entities/generation';
import type { KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof BrandService
	| typeof CabinService
	| typeof GenerationService
	| typeof KindSparePartService
	| typeof ModelService
>();
