import { CabinService } from 'entities/cabin';
import { CartService } from 'entities/cart';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import { WheelService } from 'entities/wheel';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	CabinService,
	CartService,
	SparePartService,
	TireService,
	WheelService
]);
