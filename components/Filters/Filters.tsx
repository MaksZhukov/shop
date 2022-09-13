import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Input,
	TextField,
	Typography,
} from '@mui/material';
import { fetchBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { SparePart } from 'api/kindSpareParts/types';
import { ApiResponse, CollectionParams } from 'api/types';
import { AxiosResponse } from 'axios';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { arrayOfYears } from './config';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from './constants';
import styles from './Filters.module.scss';

interface Props {
	fetchData: () => void;
	total: null | number;
}

const Filters = ({ fetchData, total }: Props) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [spareParts, setSpareParts] = useState<SparePart[]>([]);
	const router = useRouter();
	const isAwaitingCarsPage = router.pathname === '/awaiting-cars';

	const {
		min = '',
		max = '',
		brandName = '',
		brandId = '',
		modelId = '',
		modelName = '',
		sparePartId = '',
		sparePartName = '',
		yearFrom = '',
		yearTo = '',
		bodyStyle = '',
		transmission = '',
		fuel = '',
	} = router.query as {
		min: string;
		max: string;
		brandName: string;
		brandId: string;
		modelName: string;
		modelId: string;
		sparePartId: string;
		sparePartName: string;
		yearFrom: string;
		yearTo: string;
		bodyStyle: string;
		transmission: string;
		fuel: string;
	};

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				const {
					data: { data },
				} = await fetchFunc();
				setState(data);
			}
		};

	const handleChangeBrandAutocomplete = (_: any, selected: Brand | null) => {
		if (selected) {
			router.query.brandName = selected.name.toString();
			router.query.brandId = selected.id.toString();
		} else {
			delete router.query.brandName;
			delete router.query.brandId;
			delete router.query.modelName;
			delete router.query.modelId;
		}
		router.push({ pathname: router.pathname, query: router.query });
		setModels([]);
	};

	const changeParam = (params: {
		[field: string]: string | null | undefined;
	}) => {
		Object.keys(params).forEach((key) => {
			if (params[key]) {
				router.query[key] = params[key] as string;
			} else {
				delete router.query[key];
			}
		});
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeObjAutocomplete =
		(name: string, id: string) =>
		(_: any, selected: { name: string; id: number } | null) => {
			changeParam({
				[name]: selected?.name,
				[id]: selected?.id.toString(),
			});
		};

	const handleChangeAutocomplete =
		(param: string) => (_: any, selected: string | null) => {
			changeParam({ [param]: selected });
		};

	const handleChangeNumberInput =
		(param: string) => (e: ChangeEvent<HTMLInputElement>) => {
			changeParam({ [param]: e.target.value });
		};

	const handleClickFind = () => {
		fetchData();
	};

	const arrayOfYearsFrom = yearTo
		? arrayOfYears.filter((value) => +value <= +yearTo)
		: arrayOfYears;
	const arrayOfYearsTo = yearFrom
		? arrayOfYears.filter((value) => +value >= +yearFrom)
		: arrayOfYears;

	return (
		<WhiteBox>
			{!isAwaitingCarsPage && (
				<Box display='flex'>
					<Input
						fullWidth
						onChange={handleChangeNumberInput('min')}
						value={min}
						placeholder='Цена от руб'
						type='number'></Input>
					<Input
						fullWidth
						onChange={handleChangeNumberInput('max')}
						value={max}
						placeholder='Цена до руб'
						type='number'></Input>
				</Box>
			)}
			<Autocomplete
				options={brands.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='Совпадений нет'
				onOpen={handleOpenAutocomplete<Brand>(
					!!brands.length,
					setBrands,
					() =>
						fetchBrands({
							pagination: { limit: MAX_LIMIT },
						})
				)}
				onChange={handleChangeBrandAutocomplete}
				fullWidth
				value={{ label: brandName, id: +brandId, name: brandName }}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Марка'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={models.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='Совпадений нет'
				disabled={!brandId}
				onOpen={handleOpenAutocomplete<Model>(
					!!models.length,
					setModels,
					() =>
						fetchModels({
							filters: { brand: brandId },
							pagination: { limit: MAX_LIMIT },
						})
				)}
				onChange={handleChangeObjAutocomplete('modelName', 'modelId')}
				fullWidth
				value={{ label: modelName, id: +modelId, name: modelName }}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Модель'
					/>
				)}></Autocomplete>
			<Box display='flex'>
				<Autocomplete
					classes={{ inputRoot: styles['autocomplete__input-root'] }}
					options={arrayOfYearsFrom}
					fullWidth
					noOptionsText='Совпадений нет'
					onChange={handleChangeAutocomplete('yearFrom')}
					value={yearFrom}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							placeholder='Год от'
						/>
					)}></Autocomplete>
				<Autocomplete
					classes={{ inputRoot: styles['autocomplete__input-root'] }}
					options={arrayOfYearsTo}
					fullWidth
					noOptionsText='Совпадений нет'
					onChange={handleChangeAutocomplete('yearTo')}
					value={yearTo}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							placeholder='Год до'
						/>
					)}></Autocomplete>
			</Box>
			{!isAwaitingCarsPage && (
				<Autocomplete
					options={spareParts.map((item) => ({
						label: item.name,
						...item,
					}))}
					noOptionsText='Совпадений нет'
					onOpen={handleOpenAutocomplete<SparePart>(
						!!spareParts.length,
						setSpareParts,
						() =>
							fetchSpareParts({
								pagination: { limit: MAX_LIMIT },
							})
					)}
					onChange={handleChangeObjAutocomplete(
						'sparePartName',
						'sparePartId'
					)}
					value={{
						label: sparePartName,
						id: +sparePartId,
						name: sparePartName,
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							placeholder='Запчасть'
						/>
					)}></Autocomplete>
			)}
			<Input
				fullWidth
				onChange={handleChangeNumberInput('volume')}
				placeholder='Обьем 2.0'
				type='number'></Input>
			<Autocomplete
				options={BODY_STYLES}
				fullWidth
				noOptionsText='Совпадений нет'
				onChange={handleChangeAutocomplete('bodyStyle')}
				value={bodyStyle}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Кузов'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={TRANSMISSIONS}
				fullWidth
				noOptionsText='Совпадений нет'
				onChange={handleChangeAutocomplete('transmission')}
				value={transmission}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Коробка'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={FUELS}
				fullWidth
				noOptionsText='Совпадений нет'
				onChange={handleChangeAutocomplete('fuel')}
				value={fuel}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Топливо'
					/>
				)}></Autocomplete>
			<Box marginY='1em' textAlign='center'>
				<Button onClick={handleClickFind} fullWidth variant='contained'>
					Найти
				</Button>
			</Box>
			<Typography textAlign='center' variant='subtitle1' color='primary'>
				Найдено: {total}
			</Typography>
		</WhiteBox>
	);
};

export default Filters;
