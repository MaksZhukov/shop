import type { TireBrand } from 'entities/tireBrand';
import type { TireWidth } from 'entities/tireWidth';
import type { TireHeight } from 'entities/tireHeight';
import type { TireDiameter } from 'entities/tireDiameter';
import type { ReactNode } from 'react';

export interface GetTiresFiltersConfigParams {
	tireBrands: TireBrand[];
	widths: TireWidth[];
	heights: TireHeight[];
	diameters: TireDiameter[];
	noOptionsText: ReactNode;
	onChangeBrandAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeWidthAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeHeightAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeDiameterAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeSeasonAutocomplete?: (_: unknown, value: string | null) => void;
	onOpenWidthAutocomplete?: () => void;
	onOpenHeightAutocomplete?: () => void;
	onOpenDiameterAutocomplete?: () => void;
	isLoadingBrand?: boolean;
	isLoadingWidth?: boolean;
	isLoadingHeight?: boolean;
	isLoadingDiameter?: boolean;
	loadingOptionsText?: ReactNode;
}
