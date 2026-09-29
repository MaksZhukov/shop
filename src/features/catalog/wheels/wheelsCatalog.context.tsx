import { createContext, type ReactNode } from 'react';
import type { BrandService } from 'entities/brand';
import type { ModelService } from 'entities/model';
import type { WheelService } from 'entities/wheel';
import type { WheelDiameterService } from 'entities/wheelDiameter';
import type { WheelDiameterCenterHoleService } from 'entities/wheelDiameterCenterHole';
import type { WheelDiskOffsetService } from 'entities/wheelDiskOffset';
import type { WheelNumberHoleService } from 'entities/wheelNumberHole';
import type { WheelWidthService } from 'entities/wheelWidth';

export type WheelsCatalogContextValue = {
	brandService: BrandService;
	modelService: ModelService;
	wheelService: WheelService;
	wheelDiameterService: WheelDiameterService;
	wheelDiameterCenterHoleService: WheelDiameterCenterHoleService;
	wheelDiskOffsetService: WheelDiskOffsetService;
	wheelNumberHoleService: WheelNumberHoleService;
	wheelWidthService: WheelWidthService;
};

export const WheelsCatalogContext = createContext<WheelsCatalogContextValue | null>(null);

type WheelsCatalogInjectorProps = {
	value: WheelsCatalogContextValue;
	children: ReactNode;
};

export const WheelsCatalogInjector = ({ value, children }: WheelsCatalogInjectorProps) => (
	<WheelsCatalogContext.Provider value={value}>{children}</WheelsCatalogContext.Provider>
);
