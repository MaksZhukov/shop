import type { AutocompleteType } from 'features/productFilters';
import { SEASONS, SEASONS_SLUGIFY } from 'entities/tire';
import type { GetTiresFiltersConfigParams } from './types';

const onOpen = (callback?: () => void) => () => () => callback?.();

export const getTiresFiltersConfig = ({
	tireBrands,
	widths,
	heights,
	diameters,
	noOptionsText,
	onChangeBrandAutocomplete,
	onChangeWidthAutocomplete,
	onChangeHeightAutocomplete,
	onChangeDiameterAutocomplete,
	onChangeSeasonAutocomplete,
	onOpenWidthAutocomplete,
	onOpenHeightAutocomplete,
	onOpenDiameterAutocomplete,
	isLoadingBrand,
	isLoadingWidth,
	isLoadingHeight,
	isLoadingDiameter,
	loadingOptionsText
}: GetTiresFiltersConfigParams): AutocompleteType[] => [
	{
		id: 'brand',
		category: 'main',
		placeholder: 'Бренд',
		type: 'autocomplete',
		options: tireBrands.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeBrandAutocomplete,
		noOptionsText: isLoadingBrand && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'width',
		category: 'main',
		placeholder: 'Ширина',
		type: 'autocomplete',
		options: widths.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeWidthAutocomplete,
		onOpen: onOpen(onOpenWidthAutocomplete),
		noOptionsText: isLoadingWidth && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'height',
		category: 'main',
		placeholder: 'Высота',
		type: 'autocomplete',
		options: heights.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeHeightAutocomplete,
		onOpen: onOpen(onOpenHeightAutocomplete),
		noOptionsText: isLoadingHeight && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'diameter',
		category: 'main',
		placeholder: 'Диаметр',
		type: 'autocomplete',
		options: diameters.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeDiameterAutocomplete,
		onOpen: onOpen(onOpenDiameterAutocomplete),
		noOptionsText: isLoadingDiameter && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'season',
		category: 'main',
		placeholder: 'Сезон',
		type: 'autocomplete',
		options: SEASONS.map((item) => ({ label: item, value: SEASONS_SLUGIFY[item] })),
		onChange: onChangeSeasonAutocomplete,
		noOptionsText
	}
];
