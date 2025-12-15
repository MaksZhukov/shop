import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { useSnackbar } from 'notistack';
import { useDebounce, useThrottle } from 'rooks';
import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from 'shared/api/types';
import { kindSparePartApi, KindSparePart } from 'entities/kindSparePart';
import { engineVolumeApi, EngineVolume } from 'entities/engineVolume';
import { generationApi } from 'entities/generation';
import { Generation } from 'entities/generation/generationTypes';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { OFFSET_SCROLL_LOAD_MORE } from 'shared/constants';
import { FilterValues } from '../types';
import { ERROR_MESSAGES } from '../constants';

interface UseAutocompleteHandlersParams {
	generations: Generation[];
	setGenerations: Dispatch<SetStateAction<Generation[]>>;
	volumes: EngineVolume[];
	setVolumes: Dispatch<SetStateAction<EngineVolume[]>>;
	filtersValues: FilterValues;
	kindSparePart?: KindSparePart;
	onBrandChange: () => void;
	onModelChange: () => void;
}

export const useAutocompleteHandlers = ({
	generations,
	setGenerations,
	volumes,
	setVolumes,
	filtersValues,
	kindSparePart,
	onBrandChange,
	onModelChange
}: UseAutocompleteHandlersParams) => {
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({
		data: kindSparePart ? [kindSparePart] : [],
		meta: {}
	});
	const [isReloadKindSpareParts, setIsReloadKindSpareParts] = useState(true);

	// Sync kindSparePart prop with state
	useEffect(() => {
		if (kindSparePart) {
			setKindSpareParts({
				data: [kindSparePart],
				meta: {}
			});
		}
	}, [kindSparePart]);

	const loadKindSpareParts = async (initial: boolean = false) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const { data } = await kindSparePartApi.fetchKindSpareParts(
				{
					filters: {
						spareParts: {
							sold: false,
							...(filtersValues.brand && { brand: { slug: filtersValues.brand } }),
							...(filtersValues.model && { model: { slug: filtersValues.model } }),
							...(filtersValues.generation && { generation: { slug: filtersValues.generation } })
						}
					},
					pagination: { start: kindSpareParts.data.length }
				},
				{ abortController: controller }
			);

			if (initial) {
				setKindSpareParts({
					data: kindSparePart
						? [kindSparePart, ...data.data.filter((item) => item.id !== kindSparePart.id)]
						: data.data,
					meta: data.meta
				});
			} else {
				setKindSpareParts({
					data: [
						...kindSpareParts.data,
						...(kindSparePart ? data.data.filter((item) => item.id !== kindSparePart.id) : data.data)
					],
					meta: data.meta
				});
			}
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(ERROR_MESSAGES.AUTOCOMPLETE_LOAD_ERROR, { variant: 'error' });
			}
		}
	};

	const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
		setIsLoadingMore(true);
		await loadKindSpareParts();
		setIsLoadingMore(false);
	});

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const { data } = await kindSparePartApi.fetchKindSpareParts(
				{ filters: { name: { $contains: value } } },
				{ abortController: controller }
			);
			setKindSpareParts(data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(ERROR_MESSAGES.AUTOCOMPLETE_LOAD_ERROR, { variant: 'error' });
			}
		}
		setIsLoading(false);
	});

	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				setIsLoading(true);
				try {
					const {
						data: { data }
					} = await fetchFunc();
					setState(data);
				} catch (err) {
					enqueueSnackbar(ERROR_MESSAGES.AUTOCOMPLETE_FETCH_ERROR, { variant: 'error' });
				}
				setIsLoading(false);
			}
		};

	const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) => {
		const filterValues = values as FilterValues;
		return handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
			generationApi.fetchGenerations({
				filters: {
					model: { slug: filterValues.model as string },
					brand: { slug: filterValues.brand as string }
				},
				pagination: { limit: API_MAX_LIMIT }
			})
		);
	};

	const handleOpenAutocompleteKindSparePart = (_values: { [key: string]: string | null }) => async () => {
		if (
			(kindSpareParts.data.length < API_DEFAULT_LIMIT &&
				kindSpareParts.meta.pagination?.total !== kindSpareParts.data.length) ||
			isReloadKindSpareParts
		) {
			setIsLoading(true);
			setKindSpareParts({
				data: [],
				meta: {}
			});
			await loadKindSpareParts(true);
			setIsLoading(false);
			setIsReloadKindSpareParts(false);
		}
	};

	const handleOpenAutocompleteVolume = (_values: { [key: string]: string | null }) =>
		handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
			engineVolumeApi.fetchEngineVolumes({
				pagination: { limit: API_MAX_LIMIT }
			})
		);

	const handleInputChangeKindSparePart = (_: any, value: string) => {
		setIsLoading(true);
		debouncedFetchKindSparePartsRef(value);
	};

	const handleScrollKindSparePartAutocomplete = (event: React.UIEvent<HTMLDivElement | HTMLUListElement>) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
				event.currentTarget.scrollHeight &&
			kindSpareParts.meta.pagination?.total !== kindSpareParts.data.length
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	const handleChangeBrandAutocomplete = () => {
		onBrandChange();
	};

	const handleChangeModelAutocomplete = () => {
		onModelChange();
	};

	return {
		kindSpareParts: kindSpareParts.data,
		isLoading,
		isLoadingMore,
		handleOpenAutocompleteGeneration,
		handleOpenAutocompleteKindSparePart,
		handleOpenAutocompleteVolume,
		handleInputChangeKindSparePart,
		handleScrollKindSparePartAutocomplete,
		handleChangeBrandAutocomplete,
		handleChangeModelAutocomplete,
		setIsReloadKindSpareParts
	};
};

