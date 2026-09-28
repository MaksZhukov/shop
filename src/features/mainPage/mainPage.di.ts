import { ArticleService } from 'entities/article';
import { BrandService } from 'entities/brand';
import { CarOnPartsService } from 'entities/carOnParts';
import { EngineVolumeService } from 'entities/engineVolume';
import { GenerationService } from 'entities/generation';
import { KindSparePartService } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { SparePartService } from 'entities/sparePart';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	ArticleService,
	BrandService,
	CarOnPartsService,
	EngineVolumeService,
	GenerationService,
	KindSparePartService,
	ModelService,
	SparePartService
]);
