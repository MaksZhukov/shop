import { BrandService } from 'entities/brand';
import { CatalogService } from 'entities/catalog';
import { EngineVolumeService } from 'entities/engineVolume';
import { GenerationService } from 'entities/generation';
import { KindSparePartService } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { SparePartService } from 'entities/sparePart';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	BrandService,
	CatalogService,
	EngineVolumeService,
	GenerationService,
	KindSparePartService,
	ModelService,
	SparePartService
]);
