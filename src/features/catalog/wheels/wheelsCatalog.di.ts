import type { BrandService } from 'entities/brand';
import type { ModelService } from 'entities/model';
import type { WheelService } from 'entities/wheel';
import type { WheelDiameterService } from 'entities/wheelDiameter';
import type { WheelDiameterCenterHoleService } from 'entities/wheelDiameterCenterHole';
import type { WheelDiskOffsetService } from 'entities/wheelDiskOffset';
import type { WheelNumberHoleService } from 'entities/wheelNumberHole';
import type { WheelWidthService } from 'entities/wheelWidth';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof BrandService
	| typeof ModelService
	| typeof WheelService
	| typeof WheelDiameterService
	| typeof WheelDiameterCenterHoleService
	| typeof WheelDiskOffsetService
	| typeof WheelNumberHoleService
	| typeof WheelWidthService
>();
