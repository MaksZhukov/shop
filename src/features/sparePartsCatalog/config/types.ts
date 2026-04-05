import type { Brand } from 'entities/brand';
import type { Generation } from 'entities/generation';
import type { KindSparePart } from 'entities/kindSparePart';
import type { Model } from 'entities/model';
import type { ReactNode, UIEventHandler } from 'react';
import type { EngineVolume } from 'entities/engineVolume';

export interface GetSparePartsFiltersConfigParams {
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
	onOpenAutocompleteGeneration: (values: { [key: string]: string | null }) => (() => void) | (() => Promise<void>);
	onOpenAutoCompleteKindSparePart: (values: { [key: string]: string | null }) => (() => void) | (() => Promise<void>);
	onOpenAutoCompleteVolume: (values: { [key: string]: string | null }) => (() => void) | (() => Promise<void>);
	onInputChangeKindSparePart: (_: any, value: string) => void;
	onScrollKindSparePartAutocomplete: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement>;
}
