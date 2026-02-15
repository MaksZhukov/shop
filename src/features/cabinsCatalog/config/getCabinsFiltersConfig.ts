import { AutocompleteType } from 'features/productFilters';
import type { KindSparePart } from 'entities/kindSparePart';
import type { Generation } from 'entities/generation/generationTypes';
import type { ModelCabinsCountWithGenerationsCabinsCount } from 'entities/model';
import type { ReactNode } from 'react';

export interface GetCabinsFiltersConfigParams {
	brands: Array<{ id: number; name: string; slug: string; cabins?: { count: number } }>;
	models: ModelCabinsCountWithGenerationsCabinsCount[];
	kindSpareParts: KindSparePart[];
	generations: Generation[];
	isLoadingMoreKindSpareParts: boolean;
	noOptionsText: ReactNode;
	onChangeBrandAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeModelAutocomplete?: (_: unknown, value: string | null) => void;
	onChangeGenerationAutocomplete?: (_: unknown, value: string | null) => void;
	onOpenAutocompleteGeneration: (values: { [key: string]: string | null }) => (() => void) | (() => Promise<void>);
	onOpenAutoCompleteKindSparePart: (values: { [key: string]: string | null }) => (() => void) | (() => Promise<void>);
	onInputChangeKindSparePart: (_: unknown, value: string) => void;
	onScrollKindSparePartAutocomplete: React.UIEventHandler<HTMLDivElement | HTMLUListElement>;
}

export const getCabinsFiltersConfig = ({
	brands,
	models,
	kindSpareParts,
	generations,
	isLoadingMoreKindSpareParts,
	onChangeBrandAutocomplete,
	onOpenAutocompleteGeneration,
	onOpenAutoCompleteKindSparePart,
	onInputChangeKindSparePart,
	onChangeModelAutocomplete,
	onScrollKindSparePartAutocomplete,
	onChangeGenerationAutocomplete,
	noOptionsText
}: GetCabinsFiltersConfigParams): AutocompleteType[] => [
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
	}
];
