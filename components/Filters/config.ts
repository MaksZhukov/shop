import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Model } from 'api/models/types';
import { ReactNode, UIEventHandler } from 'react';

import { EngineVolume } from 'api/engineVolumes/types';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from '../../constants';

interface Params {
	storeInUrlIds?: string[];
	brands: Brand[];
	models: Model[];
	kindSpareParts: KindSparePart[];
	generations: Generation[];
	volumes: EngineVolume[];
	isLoadingMoreKindSpareParts: boolean;
	noOptionsText: ReactNode;
	onChangeGenerationAutocomplete?: (_: any, value: string | null) => void;
	onChangeBrandAutocomplete?: (_: any, value: string | null) => void;
	onChangeModelAutocomplete?: (_: any, value: string | null) => void;
	onOpenAutoCompleteBrand?: (values: { [key: string]: string | null }) => () => void;
	onOpenAutocompleteModel: (values: { [key: string]: string | null }) => () => void;
	onOpenAutocompleteGeneration: (values: { [key: string]: string | null }) => () => void;
	onOpenAutoCompleteKindSparePart: (values: { [key: string]: string | null }) => () => void;
	onOpenAutoCompleteVolume: (values: { [key: string]: string | null }) => () => void;
	onInputChangeKindSparePart: (_: any, value: string) => void;
	onScrollBrandAutocomplete: UIEventHandler<HTMLUListElement>;
	onScrollKindSparePartAutocomplete: UIEventHandler<HTMLUListElement>;
}

export const getSparePartsFiltersConfig = ({
	storeInUrlIds = [],
	brands,
	models,
	kindSpareParts,
	generations,
	volumes,
	isLoadingMoreKindSpareParts,
	onChangeBrandAutocomplete,
	onOpenAutoCompleteBrand,
	onOpenAutocompleteModel,
	onOpenAutocompleteGeneration,
	onOpenAutoCompleteKindSparePart,
	onOpenAutoCompleteVolume,
	onInputChangeKindSparePart,
	onChangeModelAutocomplete,
	onScrollBrandAutocomplete,
	onScrollKindSparePartAutocomplete,
	onChangeGenerationAutocomplete,
	noOptionsText,
}: Params) => [
	[
		{
			id: 'brand',
			placeholder: 'Марка',
			storeInUrl: storeInUrlIds.includes('brand'),
			type: 'autocomplete',
			options: brands.map((item) => ({ label: item.name, value: item.slug })),
			onChange: onChangeBrandAutocomplete,
			onOpen: onOpenAutoCompleteBrand,
			onScroll: onScrollBrandAutocomplete,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'model',
			storeInUrl: storeInUrlIds.includes('model'),
			placeholder: 'Модель',
			type: 'autocomplete',
			disabledDependencyId: 'brand',
			options: models.map((item) => item.name),
			onChange: onChangeModelAutocomplete,
			onOpen: onOpenAutocompleteModel,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'generation',
			storeInUrl: storeInUrlIds.includes('generation'),
			placeholder: 'Поколение',
			type: 'autocomplete',
			disabledDependencyId: 'model',
			options: generations.map((item) => item.name),
			onChange: onChangeGenerationAutocomplete,
			onOpen: onOpenAutocompleteGeneration,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'kindSparePart',
			storeInUrl: storeInUrlIds.includes('kindSparePart'),
			placeholder: 'Запчасть',
			type: 'autocomplete',
			options: kindSpareParts.map((item) => item.name),
			loadingMore: isLoadingMoreKindSpareParts,
			onScroll: onScrollKindSparePartAutocomplete,
			onOpen: onOpenAutoCompleteKindSparePart,
			onInputChange: onInputChangeKindSparePart,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'volume',
			storeInUrl: storeInUrlIds.includes('volume'),
			placeholder: 'Обьем 2.0',
			type: 'autocomplete',
			options: volumes.map((item) => item.name),
			onOpen: onOpenAutoCompleteVolume,
			noOptionsText: noOptionsText,
		},
	],
	[
		{
			id: 'bodyStyle',
			storeInUrl: storeInUrlIds.includes('bodyStyle'),
			placeholder: 'Кузов',
			type: 'autocomplete',
			options: BODY_STYLES,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
	[
		{
			id: 'transmission',
			storeInUrl: storeInUrlIds.includes('transmission'),
			placeholder: 'Коробка',
			type: 'autocomplete',
			options: TRANSMISSIONS,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
	[
		{
			id: 'fuel',
			storeInUrl: storeInUrlIds.includes('fuel'),
			placeholder: 'Тип топлива',
			type: 'autocomplete',
			options: FUELS,
			onOpen: () => {},
			noOptionsText: '',
		},
	],
];
