import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { Brand } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { ApiResponse, Filters } from 'api/types';
import axios, { AxiosResponse } from 'axios';
import Autocomplete from 'components/ui/Autocomplete';
import Typography from 'components/ui/Typography';
import WhiteBox from 'components/ui/WhiteBox';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'components/icons';
import { Button } from 'components/ui';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import qs from 'qs';
import { Dispatch, SetStateAction, UIEventHandler, useRef, useState, SyntheticEvent } from 'react';
import { useDebounce, useThrottle } from 'rooks';
import {
	BODY_STYLES_OPTIONS,
	FUELS_OPTIONS,
	OFFSET_SCROLL_LOAD_MORE,
	TRANSMISSIONS_OPTIONS
} from '../../../../constants';
import { fetchEngineVolumes } from 'api/engineVolumes/engineVolumes';
import { EngineVolume } from 'api/engineVolumes/types';
import { useQuery } from '@tanstack/react-query';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { getParamByRelation } from 'services/ParamsService';
import { SLUGIFY_BODY_STYLES, SLUGIFY_FUELS, SLUGIFY_TRANSMISSIONS } from 'config';
import { SparePart } from 'api/spareParts/types';

interface SearchFormProps {
	brands: Brand[];
	sparePartsTotal: number;
}

interface FormValues {
	[key: string]: string | null;
}

interface AutocompleteOption {
	label: string;
	value: string;
}

interface AutocompleteChangeEvent {
	value: string;
	label: string;
}

type AutocompleteHandler = (
	event: SyntheticEvent<Element, Event>,
	value: AutocompleteChangeEvent | string | null
) => void;

export const SearchForm: React.FC<SearchFormProps> = ({ brands, sparePartsTotal }) => {
	const [isMoreFilters, setIsMoreFilters] = useState(false);
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
	const [engineVolumes, setEngineVolumes] = useState<EngineVolume[]>([]);
	const [values, setValues] = useState<FormValues>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const { data: totalSpareParts } = useQuery<AxiosResponse<ApiResponse<SparePart[]>>>({
		queryKey: [
			'total-spare-parts',
			values.brand,
			values.model,
			values.generation,
			values.kindSparePart,
			values.volume,
			values.fuel,
			values.bodyStyle,
			values.transmission
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchSpareParts({
				filters: { ...generateFiltersByQuery(values), sold: false },
				pagination: { limit: 0 }
			})
	});

	const total = totalSpareParts?.data.meta.pagination?.total || sparePartsTotal;

	const generateFiltersByQuery = ({
		brand,
		model,
		generation,
		kindSparePart,
		volume,
		fuel,
		bodyStyle,
		transmission
	}: {
		[key: string]: string | null;
	}): Filters => {
		const filters: Filters = {
			brand: getParamByRelation(brand, 'slug'),
			model: getParamByRelation(model, 'slug'),
			generation: getParamByRelation(generation, 'slug'),
			kindSparePart: getParamByRelation(kindSparePart, 'slug'),
			volume: getParamByRelation(volume),
			fuel: fuel ? SLUGIFY_FUELS[fuel] : null,
			bodyStyle: bodyStyle ? SLUGIFY_BODY_STYLES[bodyStyle] : null,
			transmission: transmission ? SLUGIFY_TRANSMISSIONS[transmission] : null
		};
		return filters;
	};

	const showError = (message: string) => {
		enqueueSnackbar(message, { variant: 'error' });
	};

	const loadKindSpareParts = async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const { data } = await fetchKindSpareParts(
				{ pagination: { start: kindSpareParts.data.length } },
				{ abortController: controller }
			);
			setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
		} catch (err) {
			if (!axios.isCancel(err)) {
				showError('Произошла ошибка при загрузке данных для автозаполнения');
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
			const { data } = await fetchKindSpareParts(
				{ filters: { name: { $contains: value } } },
				{ abortController: controller }
			);
			setKindSpareParts(data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				showError('Произошла ошибка при загрузке данных для автозаполнения');
			}
		}
		setIsLoading(false);
	});

	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

	const updateValue = (id: string, selected: AutocompleteChangeEvent | string | null) => {
		const value = typeof selected === 'string' ? selected : selected?.value || null;
		setValues((prev) => ({ ...prev, [id]: value }));
	};

	const createAutocompleteHandler =
		<T,>(
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
					showError('Произошла ошибка при загрузке данных для автозаполнения');
				}
				setIsLoading(false);
			}
		};

	const handleChangeBrandAutocomplete: AutocompleteHandler = (_, selected) => {
		updateValue('brand', selected);
		updateValue('model', null);
		updateValue('generation', null);
		setModels([]);
		setGenerations([]);
	};

	const handleChangeModelAutocomplete: AutocompleteHandler = (_, selected) => {
		updateValue('model', selected);
		updateValue('generation', null);
	};

	const handleChangeAutocomplete =
		(id: string): AutocompleteHandler =>
		(_, selected) => {
			updateValue(id, selected);
		};

	const handleOpenEngineVolumeAutocomplete = createAutocompleteHandler<EngineVolume>(
		!!engineVolumes.length,
		setEngineVolumes,
		() => fetchEngineVolumes({ pagination: { limit: API_MAX_LIMIT } })
	);

	const handleOpenAutocompleteModel = createAutocompleteHandler<Model>(!!models.length, setModels, () =>
		fetchModels({
			filters: { brand: { slug: values.brand } },
			pagination: { limit: API_MAX_LIMIT }
		})
	);

	const handleOpenAutocompleteGeneration = createAutocompleteHandler<Generation>(
		!!generations.length,
		setGenerations,
		() =>
			fetchGenerations({
				filters: { brand: { slug: values.brand }, model: { slug: values.model } },
				pagination: { limit: API_MAX_LIMIT }
			})
	);

	const handleOpenAutocompleteKindSparePart = async () => {
		if (!kindSpareParts.data.length) {
			setIsLoading(true);
			await loadKindSpareParts();
			setIsLoading(false);
		}
	};

	const handleInputChangeKindSparePart = (_: SyntheticEvent<Element, Event>, value: string) => {
		setIsLoading(true);
		debouncedFetchKindSparePartsRef(value);
	};

	const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement> = (
		event
	) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
			event.currentTarget.scrollHeight
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	const handleClickFind = () => {
		const { brand, model, kindSparePart, ...restValues } = values;
		const sanitizedValues = Object.keys(restValues).reduce(
			(prev, curr) => (restValues[curr] ? { ...prev, [curr]: restValues[curr] } : prev),
			{}
		);

		const query = qs.stringify(sanitizedValues, { encode: false });
		const formattedQuery = query ? `?${query}` : '';

		let url = `/spare-parts`;
		if (brand) {
			url += `/${brand}`;
			if (model) {
				url += `/model-${model}`;
			}
		}
		url += formattedQuery;

		router.push(url);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const createAutocompleteProps = (config: {
		options: AutocompleteOption[];
		noOptionsText: React.ReactNode;
		placeholder: string;
		onChange?: AutocompleteHandler;
		onOpen?: () => void;
		onInputChange?: (event: SyntheticEvent<Element, Event>, value: string) => void;
		onScroll?: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement>;
		loadingMore?: boolean;
		disabled?: boolean;
	}) => ({
		options: config.options,
		noOptionsText: config.noOptionsText,
		placeholder: config.placeholder,
		onChange: config.onChange,
		onOpen: config.onOpen,
		onInputChange: config.onInputChange,
		onScroll: config.onScroll,
		disabled: config.disabled,
		fullWidth: true
	});

	const brandAutocompleteProps = createAutocompleteProps({
		options: brands.map((item) => ({ label: item.name, value: item.slug })),
		noOptionsText,
		placeholder: 'Марка',
		onChange: handleChangeBrandAutocomplete
	});

	const modelAutocompleteProps = createAutocompleteProps({
		options: models.map((item) => ({ label: item.name, value: item.slug })),
		noOptionsText,
		placeholder: 'Модель',
		onChange: handleChangeModelAutocomplete,
		onOpen: handleOpenAutocompleteModel,
		disabled: !values.brand
	});

	const generationAutocompleteProps = createAutocompleteProps({
		options: generations.map((item) => ({ label: item.name, value: item.slug })),
		noOptionsText,
		placeholder: 'Поколение',
		onOpen: handleOpenAutocompleteGeneration,
		onChange: handleChangeAutocomplete('generation'),
		disabled: !values.model
	});

	const kindSparePartAutocompleteProps = createAutocompleteProps({
		options: kindSpareParts.data.map((item) => ({ label: item.name, value: item.slug })),
		noOptionsText,
		placeholder: 'Выбрать запчасть',
		onChange: handleChangeAutocomplete('kindSparePart'),
		onOpen: handleOpenAutocompleteKindSparePart,
		onInputChange: handleInputChangeKindSparePart,
		onScroll: handleScrollKindSparePartAutocomplete,
		loadingMore: isLoadingMore
	});

	const engineVolumeAutocompleteProps = createAutocompleteProps({
		options: engineVolumes.map((item) => ({ label: item.name, value: item.name })),
		noOptionsText,
		placeholder: 'Объем двигателя',
		onChange: handleChangeAutocomplete('engineVolume'),
		onOpen: handleOpenEngineVolumeAutocomplete
	});

	const fuelAutocompleteProps = createAutocompleteProps({
		options: FUELS_OPTIONS,
		noOptionsText,
		placeholder: 'Тип топлива',
		onChange: handleChangeAutocomplete('fuel')
	});

	const bodyStyleAutocompleteProps = createAutocompleteProps({
		options: BODY_STYLES_OPTIONS,
		noOptionsText,
		placeholder: 'Кузов',
		onChange: handleChangeAutocomplete('bodyStyle')
	});

	const transmissionAutocompleteProps = createAutocompleteProps({
		options: TRANSMISSIONS_OPTIONS,
		noOptionsText,
		placeholder: 'Коробка',
		onChange: handleChangeAutocomplete('transmission')
	});

	const toggleMoreFilters = () => {
		setIsMoreFilters(!isMoreFilters);
	};

	return (
		<Box width={{ xs: '100%', md: 360 }}>
			<Typography mb={1} textAlign='center' color='textSecondary' variant='h6'>
				Поиск автозапчастей
			</Typography>
			<WhiteBox px={2} py={1} gap={1} withShadow>
				<Tabs sx={{ mb: 2 }} value='brand'>
					<Tab label='По марке авто' value='brand' />
				</Tabs>
				<Box gap={1} display='flex' flexDirection='column'>
					<Box display='flex' gap={1}>
						<Autocomplete {...brandAutocompleteProps} />
						<Autocomplete {...modelAutocompleteProps} />
					</Box>
					<Autocomplete {...generationAutocompleteProps} />
					<Autocomplete {...kindSparePartAutocompleteProps} />
					<Button
						size='small'
						sx={{ alignSelf: 'flex-start' }}
						onClick={toggleMoreFilters}
						endIcon={isMoreFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
					>
						{isMoreFilters ? 'Меньше параметров' : 'Больше параметров поиска'}
					</Button>
					{isMoreFilters && (
						<>
							<Autocomplete {...engineVolumeAutocompleteProps} />
							<Autocomplete {...fuelAutocompleteProps} />
							<Autocomplete {...bodyStyleAutocompleteProps} />
							<Autocomplete {...transmissionAutocompleteProps} />
						</>
					)}
					<Button onClick={handleClickFind} variant='contained'>
						Показать : {total}
					</Button>
				</Box>
			</WhiteBox>
		</Box>
	);
};
