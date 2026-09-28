import type { TireService } from 'entities/tire';
import type { TireBrandService } from 'entities/tireBrand';
import type { TireDiameterService } from 'entities/tireDiameter';
import type { TireHeightService } from 'entities/tireHeight';
import type { TireWidthService } from 'entities/tireWidth';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof TireService
	| typeof TireBrandService
	| typeof TireDiameterService
	| typeof TireHeightService
	| typeof TireWidthService
>();
