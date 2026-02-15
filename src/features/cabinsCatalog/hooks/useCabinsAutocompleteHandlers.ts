import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { useSnackbar } from 'notistack';
import { useDebounce, useThrottle } from 'rooks';
import axios from 'axios';
import type { ApiResponse } from 'shared/api/types';
import { kindSparePartApi, type KindSparePart } from 'entities/kindSparePart';
import { generationApi } from 'entities/generation';
import type { Generation } from 'entities/generation/generationTypes';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { OFFSET_SCROLL_LOAD_MORE } from 'shared/constants';
import type { CabinsFilterValues } from '../types';
import { ERROR_MESSAGES } from '../constants';

interface UseCabinsAutocompleteHandlersParams {
	generations: Generation[];
	setGenerations: Dispatch<SetStateAction<Generation[]>>;
	filtersValues: CabinsFilterValues;
	kindSparePart?: KindSparePart;
	onBrandChange: () => void;
	onModelChange: () => void;
}

export const useCabinsAutocompleteHandlers = ({
	generations,
	setGenerations,
	filtersValues,
	kindSparePart,
	onBrandChange,
	onModelChange
}: UseCabinsAutocompleteHandlersParams) => {
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({
		data: kindSparePart ? [kindSparePart] : [],
		meta: {}
	});
	const [isReloadKindSpareParts, setIsReloadKindSpareParts] = useState(true);

	useEffect(() => {
		if (kindSparePart) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
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
						type: 'cabin',
						cabins: {
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

	const fetchKindSpareParts = async (value: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const { data } = await kindSparePartApi.fetchKindSpareParts(
				{ filters: { name: { $contains: value }, type: 'cabin' } },
				{ abortController: controller }
			);
			setKindSpareParts(data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(ERROR_MESSAGES.AUTOCOMPLETE_LOAD_ERROR, { variant: 'error' });
			}
		}
		setIsLoading(false);
	};

	const debouncedFetchKindSpareParts = useDebounce(fetchKindSpareParts, 300);

	const handleInputChangeKindSparePart = useCallback(
		(_: unknown, value: string) => {
			setIsLoading(true);
			debouncedFetchKindSpareParts(value);
		},
		[debouncedFetchKindSpareParts]
	);

	const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) => {
		const filterValues = values as CabinsFilterValues;
		return async () => {
			if (!generations.length) {
				setIsLoading(true);
				try {
					const {
						data: { data }
					} = await generationApi.fetchGenerations({
						filters: {
							model: { slug: filterValues.model as string },
							brand: { slug: filterValues.brand as string }
						},
						pagination: { limit: API_MAX_LIMIT }
					});
					setGenerations(data);
				} catch (err) {
					enqueueSnackbar(ERROR_MESSAGES.AUTOCOMPLETE_FETCH_ERROR, { variant: 'error' });
				}
				setIsLoading(false);
			}
		};
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

	const handleScrollKindSparePartAutocomplete = (event: React.UIEvent<HTMLDivElement | HTMLUListElement>) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
				event.currentTarget.scrollHeight &&
			kindSpareParts.meta.pagination?.total !== kindSpareParts.data.length
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	return {
		kindSpareParts: kindSpareParts.data,
		isLoading,
		isLoadingMore,
		handleOpenAutocompleteGeneration,
		handleOpenAutocompleteKindSparePart,
		handleInputChangeKindSparePart,
		handleScrollKindSparePartAutocomplete,
		handleChangeBrandAutocomplete: onBrandChange,
		handleChangeModelAutocomplete: onModelChange,
		setIsReloadKindSpareParts
	};
};
