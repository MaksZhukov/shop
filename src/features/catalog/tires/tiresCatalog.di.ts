import { TireService } from 'entities/tire';
import { TireBrandService } from 'entities/tireBrand';
import { TireDiameterService } from 'entities/tireDiameter';
import { TireHeightService } from 'entities/tireHeight';
import { TireWidthService } from 'entities/tireWidth';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	TireService,
	TireBrandService,
	TireDiameterService,
	TireHeightService,
	TireWidthService
]);
