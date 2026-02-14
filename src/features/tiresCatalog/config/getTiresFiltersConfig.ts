import { AutocompleteType } from 'features/productFilters';
import { SEASONS, SEASONS_SLUGIFY } from 'entities/tire';
import type { GetTiresFiltersConfigParams } from './types';

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
	onChangeSeasonAutocomplete
}: GetTiresFiltersConfigParams): AutocompleteType[] => [
	{
		id: 'brand',
		category: 'main',
		placeholder: 'Бренд',
		type: 'autocomplete',
		options: tireBrands.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeBrandAutocomplete,
		noOptionsText
	},
	{
		id: 'width',
		category: 'main',
		placeholder: 'Ширина',
		type: 'autocomplete',
		options: widths.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeWidthAutocomplete,
		noOptionsText
	},
	{
		id: 'height',
		category: 'main',
		placeholder: 'Высота',
		type: 'autocomplete',
		options: heights.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeHeightAutocomplete,
		noOptionsText
	},
	{
		id: 'diameter',
		category: 'main',
		placeholder: 'Диаметр',
		type: 'autocomplete',
		options: diameters.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeDiameterAutocomplete,
		noOptionsText
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
