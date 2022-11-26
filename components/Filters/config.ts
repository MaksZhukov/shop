import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Model } from 'api/models/types';
import { ReactNode } from 'react';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from './constants';

interface Params {
	brands: Brand[];
	models: Model[];
	kindSpareParts: KindSparePart[];
	generations: Generation[];
	noOptionsText: ReactNode;
	modelId: string;
	brandId: string;
	onOpenAutoCompleteBrand?: () => void;
	onChangeBrandAutocomplete: (_: any, selected: Brand | null) => void;
	onOpenAutocompleteModel: () => void;
	onOpenAutocompleteGeneration: () => void;
	onOpenAutoCompleteKindSparePart: () => void;
}

export const getSparePartsFiltersConfig = ({
	brands,
	models,
	kindSpareParts,
	generations,
	modelId,
	brandId,
	onOpenAutoCompleteBrand,
	onChangeBrandAutocomplete,
	onOpenAutocompleteModel,
	onOpenAutocompleteGeneration,
	onOpenAutoCompleteKindSparePart,
	noOptionsText,
}: Params) => [
	[
		{
			id: 'brandId',
			name: 'brandName',
			placeholder: 'Марка',
			disabled: false,
			type: 'autocomplete',
			options: brands.map((item) => ({ label: item.name, ...item })),
			onOpen: onOpenAutoCompleteBrand,
			onChange: onChangeBrandAutocomplete,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'modelId',
			name: 'modelName',
			placeholder: 'Модель',
			type: 'autocomplete',
			disabled: !brandId,
			options: models.map((item) => ({ label: item.name, ...item })),
			onOpen: onOpenAutocompleteModel,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'generationId',
			name: 'generationName',
			placeholder: 'Поколение',
			type: 'autocomplete',
			disabled: !modelId,
			options: generations.map((item) => ({
				label: item.name,
				...item,
			})),
			onOpen: onOpenAutocompleteGeneration,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'kindSparePartId',
			name: 'kindSparePartName',
			placeholder: 'Запчасть',
			type: 'autocomplete',
			disabled: false,
			options: kindSpareParts.map((item) => ({
				label: item.name,
				...item,
			})),
			onOpen: onOpenAutoCompleteKindSparePart,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'volume',
			placeholder: 'Обьем 2.0',
			type: 'number',
			disabled: false,
		},
	],
	[
		{
			id: 'bodyStyle',
			placeholder: 'Кузов',
			type: 'autocomplete',
			disabled: false,
			options: BODY_STYLES,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
	[
		{
			id: 'transmission',
			placeholder: 'Коробка',
			type: 'autocomplete',
			disabled: false,
			options: TRANSMISSIONS,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
	[
		{
			id: 'fuel',
			placeholder: 'Тип топлива',
			type: 'autocomplete',
			disabled: false,
			options: FUELS,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
];
