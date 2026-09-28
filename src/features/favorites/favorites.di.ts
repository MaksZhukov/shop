import type { CabinService } from 'entities/cabin';
import type { FavoriteService } from 'entities/favorite';
import type { SparePartService } from 'entities/sparePart';
import type { TireService } from 'entities/tire';
import type { WheelService } from 'entities/wheel';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	typeof CabinService | typeof FavoriteService | typeof SparePartService | typeof TireService | typeof WheelService
>();
