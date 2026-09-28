import { BrandService } from 'entities/brand';
import { CabinService } from 'entities/cabin';
import { GenerationService } from 'entities/generation';
import { KindSparePartService } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	BrandService,
	CabinService,
	GenerationService,
	KindSparePartService,
	ModelService
]);
