import {
	BODY_STYLES_SLUGIFY,
	FUELS_SLUGIFY,
	TRANSMISSIONS_SLUGIFY,
	BODY_STYLES,
	FUELS,
	TRANSMISSIONS
} from 'entities/car';
import type { AutocompleteType, NumberType } from 'features/productFilters';
import type { GetSparePartsFiltersConfigParams } from './types';

export const getSparePartsFiltersConfig = ({
	brands,
	models,
	kindSpareParts,
	generations,
	volumes,
	isLoadingMoreKindSpareParts,
	onChangeBrandAutocomplete,
	onOpenAutocompleteGeneration,
	onOpenAutoCompleteKindSparePart,
	onOpenAutoCompleteVolume,
	onInputChangeKindSparePart,
	onChangeModelAutocomplete,
	onScrollKindSparePartAutocomplete,
	onChangeGenerationAutocomplete,
	noOptionsText
}: GetSparePartsFiltersConfigParams): (AutocompleteType | NumberType)[] => [
	{
		id: 'brand',
		category: 'main',
		placeholder: 'Марка',
		type: 'autocomplete',
		options: brands.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeBrandAutocomplete,
		noOptionsText: noOptionsText
	},
	{
		id: 'model',
		category: 'main',
		placeholder: 'Модель',
		type: 'autocomplete',
		disabledDependencyId: 'brand',
		options: models.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeModelAutocomplete,
		noOptionsText: noOptionsText
	},
	{
		id: 'generation',
		category: 'main',
		placeholder: 'Поколение',
		type: 'autocomplete',
		disabledDependencyId: 'model',
		options: generations.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeGenerationAutocomplete,
		onOpen: onOpenAutocompleteGeneration,
		noOptionsText: noOptionsText
	},
	{
		id: 'kindSparePart',
		category: 'main',
		placeholder: 'Вид запчасти',
		type: 'autocomplete',
		options: kindSpareParts.map((item) => ({ label: item.name, value: item.slug })),
		loadingMore: isLoadingMoreKindSpareParts,
		onScroll: onScrollKindSparePartAutocomplete,
		onOpen: onOpenAutoCompleteKindSparePart,
		onInputChange: onInputChangeKindSparePart,
		noOptionsText: noOptionsText
	},
	{
		id: 'volume',
		category: 'additional',
		placeholder: 'Обьем 2.0',
		type: 'autocomplete',
		options: volumes.map((item) => item.name),
		onOpen: onOpenAutoCompleteVolume,
		noOptionsText: noOptionsText
	},
	{
		id: 'bodyStyle',
		category: 'additional',
		placeholder: 'Кузов',
		type: 'autocomplete',
		options: BODY_STYLES.map((item) => ({ label: item, value: BODY_STYLES_SLUGIFY[item] })),
		noOptionsText: ''
	},
	{
		id: 'transmission',
		category: 'additional',
		placeholder: 'Коробка',
		type: 'autocomplete',
		options: TRANSMISSIONS.map((item) => ({ label: item, value: TRANSMISSIONS_SLUGIFY[item] })),
		noOptionsText: ''
	},
	{
		id: 'fuel',
		category: 'additional',
		placeholder: 'Тип топлива',
		type: 'autocomplete',
		options: FUELS.map((item) => ({ label: item, value: FUELS_SLUGIFY[item] })),
		noOptionsText: ''
	}
];

