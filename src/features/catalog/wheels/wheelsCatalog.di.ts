import { BrandService } from 'entities/brand';
import { ModelService } from 'entities/model';
import { WheelService } from 'entities/wheel';
import { WheelDiameterService } from 'entities/wheelDiameter';
import { WheelDiameterCenterHoleService } from 'entities/wheelDiameterCenterHole';
import { WheelDiskOffsetService } from 'entities/wheelDiskOffset';
import { WheelNumberHoleService } from 'entities/wheelNumberHole';
import { WheelWidthService } from 'entities/wheelWidth';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([
	BrandService,
	ModelService,
	WheelService,
	WheelDiameterService,
	WheelDiameterCenterHoleService,
	WheelDiskOffsetService,
	WheelNumberHoleService,
	WheelWidthService
]);
