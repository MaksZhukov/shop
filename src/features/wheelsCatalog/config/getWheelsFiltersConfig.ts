import { AutocompleteType, NumberType } from 'features/productFilters';
import { KIND_WHEELS, KIND_WHEELS_SLUGIFY } from 'entities/wheel';
import type { GetWheelsFiltersConfigParams } from './types';

const onOpen = (callback?: () => void) => () => () => callback?.();

export const getWheelsFiltersConfig = ({
	brands,
	models,
	diameters,
	widths,
	numberHoles,
	diameterCenterHoles,
	diskOffsets,
	noOptionsText,
	onChangeKindAutocomplete,
	onChangeBrandAutocomplete,
	onChangeModelAutocomplete,
	onChangeWidthAutocomplete,
	onChangeDiameterAutocomplete,
	onChangeNumberHolesAutocomplete,
	onChangeDiameterCenterHoleAutocomplete,
	onChangeDistanceBetweenCenters,
	onChangeDiskOffsetAutocomplete,
	onOpenDiameterAutocomplete,
	onOpenWidthAutocomplete,
	onOpenNumberHolesAutocomplete,
	onOpenDiameterCenterHoleAutocomplete,
	onOpenDiskOffsetAutocomplete,
	isLoadingBrand,
	isLoadingModel,
	isLoadingDiameter,
	isLoadingWidth,
	isLoadingNumberHoles,
	isLoadingDiameterCenterHole,
	isLoadingDiskOffset,
	loadingOptionsText
}: GetWheelsFiltersConfigParams): (AutocompleteType | NumberType)[] => [
	{
		id: 'kind',
		category: 'main',
		placeholder: 'Тип диска',
		type: 'autocomplete',
		options: KIND_WHEELS.map((item) => ({ label: item, value: KIND_WHEELS_SLUGIFY[item] })),
		onChange: onChangeKindAutocomplete,
		noOptionsText
	},
	{
		id: 'brand',
		category: 'main',
		placeholder: 'Марка',
		type: 'autocomplete',
		options: brands.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeBrandAutocomplete,
		noOptionsText: isLoadingBrand && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'model',
		category: 'main',
		placeholder: 'Модель',
		type: 'autocomplete',
		disabledDependencyId: 'brand',
		options: models.map((item) => ({ label: item.name, value: item.slug })),
		onChange: onChangeModelAutocomplete,
		noOptionsText: isLoadingModel && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'width',
		category: 'main',
		placeholder: 'J ширина, мм',
		type: 'autocomplete',
		options: widths.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeWidthAutocomplete,
		onOpen: onOpen(onOpenWidthAutocomplete),
		noOptionsText: isLoadingWidth && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'diameter',
		category: 'main',
		placeholder: 'R диаметр, дюйм',
		type: 'autocomplete',
		options: diameters.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeDiameterAutocomplete,
		onOpen: onOpen(onOpenDiameterAutocomplete),
		noOptionsText: isLoadingDiameter && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'numberHoles',
		category: 'main',
		placeholder: 'Количество отверстий',
		type: 'autocomplete',
		options: numberHoles.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeNumberHolesAutocomplete,
		onOpen: onOpen(onOpenNumberHolesAutocomplete),
		noOptionsText: isLoadingNumberHoles && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'diameterCenterHole',
		category: 'main',
		placeholder: 'DIA диаметр центрального отверстия, мм',
		type: 'autocomplete',
		options: diameterCenterHoles.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeDiameterCenterHoleAutocomplete,
		onOpen: onOpen(onOpenDiameterCenterHoleAutocomplete),
		noOptionsText: isLoadingDiameterCenterHole && loadingOptionsText ? loadingOptionsText : noOptionsText
	},
	{
		id: 'distanceBetweenCenters',
		category: 'main',
		placeholder: 'PCD расстояние, мм',
		type: 'number',
		onChange: onChangeDistanceBetweenCenters
	},
	{
		id: 'diskOffset',
		category: 'main',
		placeholder: 'ЕТ вылет, мм',
		type: 'autocomplete',
		options: diskOffsets.map((item) => ({ label: item.name, value: item.name })),
		onChange: onChangeDiskOffsetAutocomplete,
		onOpen: onOpen(onOpenDiskOffsetAutocomplete),
		noOptionsText: isLoadingDiskOffset && loadingOptionsText ? loadingOptionsText : noOptionsText
	}
];
