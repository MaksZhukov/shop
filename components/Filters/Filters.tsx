import { Autocomplete, Box, Button, Input, TextField } from '@mui/material';
import { getBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { MAX_LIMIT } from 'api/constants';
import { getModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { getSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { arrayOfYears } from './config';

interface Props {
	fetchProducts: () => void;
}

const Filters = ({ fetchProducts }: Props) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [spareParts, setSpareParts] = useState<SparePart[]>([]);
	const router = useRouter();

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
	};

	const handleOpenBrandAutocomplete = async () => {
		if (!brands.length) {
			const {
				data: { data },
			} = await getBrands({ pagination: { limit: MAX_LIMIT } });
			setBrands(data);
		}
	};

	const handleOpenModelAutocomplete = async () => {
		if (!models.length) {
			const {
				data: { data },
			} = await getModels({
				filters: { brand: brandId },
				pagination: { limit: MAX_LIMIT },
			});
			setModels(data);
		}
	};

	const handleOpenSparePartAutocomplete = async () => {
		if (!models.length) {
			const {
				data: { data },
			} = await getSpareParts({ pagination: { limit: MAX_LIMIT } });
			setSpareParts(data);
		}
	};

	const handleChangeBrandAutocomplete = (_, selected: Brand | null) => {
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

	const handleChangeModelAutocomplete = (_, selected: Model | null) => {
		if (selected) {
			router.query.modelName = selected.name.toString();
			router.query.modelId = selected.id.toString();
		} else {
			delete router.query.modelName;
			delete router.query.modelId;
		}
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeSparePartAutocomplete = (
		_,
		selected: SparePart | null
	) => {
		if (selected) {
			router.query.sparePartName = selected.name.toString();
			router.query.sparePartId = selected.id.toString();
		} else {
			delete router.query.sparePartName;
			delete router.query.sparePartId;
		}
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeYearToAutocomplete = (_, selected: string | null) => {
		if (selected) {
			router.query.yearTo = selected;
		} else {
			delete router.query.yearTo;
		}
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeYearFromAutocomplete = (_, selected: string | null) => {
		if (selected) {
			router.query.yearFrom = selected;
		} else {
			delete router.query.yearFrom;
		}
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
		router.query.min = e.target.value;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
		router.query.max = e.target.value;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleClickFind = () => {
		fetchProducts();
	};

	const arrayOfYearsFrom = yearTo
		? arrayOfYears.filter((value) => +value <= +yearTo)
		: arrayOfYears;
	const arrayOfYearsTo = yearFrom
		? arrayOfYears.filter((value) => +value >= +yearFrom)
		: arrayOfYears;

	return (
		<WhiteBox>
			<Box display='flex'>
				<Input
					onChange={handleChangeMin}
					value={min}
					placeholder='Цена от руб'
					type='number'></Input>
				<Input
					onChange={handleChangeMax}
					value={max}
					placeholder='Цена до руб'
					type='number'></Input>
			</Box>
			<Autocomplete
				options={brands.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='Совпадений нет'
				onOpen={handleOpenBrandAutocomplete}
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
				onOpen={handleOpenModelAutocomplete}
				onChange={handleChangeModelAutocomplete}
				fullWidth
				value={{ label: modelName, id: +modelId, name: modelName }}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Модель'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={arrayOfYearsFrom}
				fullWidth
				noOptionsText='Совпадений нет'
				onChange={handleChangeYearFromAutocomplete}
				value={yearFrom}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Год от'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={arrayOfYearsTo}
				fullWidth
				noOptionsText='Совпадений нет'
				onChange={handleChangeYearToAutocomplete}
				value={yearTo}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='Год до'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={spareParts.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='Совпадений нет'
				onOpen={handleOpenSparePartAutocomplete}
				onChange={handleChangeSparePartAutocomplete}
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
			<Box marginTop='1em' textAlign='center'>
				<Button onClick={handleClickFind} fullWidth variant='contained'>
					Найти
				</Button>
			</Box>
		</WhiteBox>
	);
};

export default Filters;
