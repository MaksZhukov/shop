import { CabinService } from 'entities/cabin';
import { FavoriteService } from 'entities/favorite';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import { WheelService } from 'entities/wheel';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	CabinService,
	FavoriteService,
	SparePartService,
	TireService,
	WheelService
]);
