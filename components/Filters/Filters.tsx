import { Autocomplete, Box, Button, Input, TextField } from '@mui/material';
import { getBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { MAX_LIMIT } from 'api/constants';
import { getModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { getSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import { CollectionParams } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { arrayOfYears } from './config';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from './constants';
import styles from './Filters.module.scss';

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
		(
			hasData: boolean,
			setState: Dispatch<SetStateAction<any>>,
			fetchFunc: (params: CollectionParams) => Promise<any>
		) =>
		async () => {
			if (!hasData) {
				const {
					data: { data },
				} = await fetchFunc({ pagination: { limit: MAX_LIMIT } });
				setState(data);
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
		(_, selected: { name: string; id: number } | null) => {
			changeParam({
				[name]: selected?.name,
				[id]: selected?.id.toString(),
			});
		};

	const handleChangeAutocomplete =
		(param: string) => (_, selected: string | null) => {
			changeParam({ [param]: selected });
		};

	const handleChangeNumberInput =
		(param: string) => (e: ChangeEvent<HTMLInputElement>) => {
			changeParam({ [param]: e.target.value });
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
					onChange={handleChangeNumberInput('min')}
					value={min}
					placeholder='???????? ???? ??????'
					type='number'></Input>
				<Input
					onChange={handleChangeNumberInput('max')}
					value={max}
					placeholder='???????? ???? ??????'
					type='number'></Input>
			</Box>
			<Autocomplete
				options={brands.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='???????????????????? ??????'
				onOpen={handleOpenAutocomplete(
					!!brands.length,
					setBrands,
					getBrands
				)}
				onChange={handleChangeBrandAutocomplete}
				fullWidth
				value={{ label: brandName, id: +brandId, name: brandName }}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='??????????'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={models.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='???????????????????? ??????'
				disabled={!brandId}
				onOpen={handleOpenAutocomplete(
					!!models.length,
					setModels,
					getModels
				)}
				onChange={handleChangeObjAutocomplete('modelName', 'modelId')}
				fullWidth
				value={{ label: modelName, id: +modelId, name: modelName }}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='????????????'
					/>
				)}></Autocomplete>
			<Box display='flex'>
				<Autocomplete
					classes={{ inputRoot: styles['autocomplete__input-root'] }}
					options={arrayOfYearsFrom}
					fullWidth
					noOptionsText='???????????????????? ??????'
					onChange={handleChangeAutocomplete('yearFrom')}
					value={yearFrom}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							placeholder='?????? ????'
						/>
					)}></Autocomplete>
				<Autocomplete
					classes={{ inputRoot: styles['autocomplete__input-root'] }}
					options={arrayOfYearsTo}
					fullWidth
					noOptionsText='???????????????????? ??????'
					onChange={handleChangeAutocomplete('yearTo')}
					value={yearTo}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							placeholder='?????? ????'
						/>
					)}></Autocomplete>
			</Box>
			<Autocomplete
				options={spareParts.map((item) => ({
					label: item.name,
					...item,
				}))}
				noOptionsText='???????????????????? ??????'
				onOpen={handleOpenAutocomplete(
					!!spareParts.length,
					setSpareParts,
					getSpareParts
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
						placeholder='????????????????'
					/>
				)}></Autocomplete>
			<Input
				onChange={handleChangeNumberInput('volume')}
				placeholder='?????????? 2.0'
				type='number'></Input>
			<Autocomplete
				options={BODY_STYLES}
				fullWidth
				noOptionsText='???????????????????? ??????'
				onChange={handleChangeAutocomplete('bodyStyle')}
				value={bodyStyle}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='??????????'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={TRANSMISSIONS}
				fullWidth
				noOptionsText='???????????????????? ??????'
				onChange={handleChangeAutocomplete('transmission')}
				value={transmission}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='??????????????'
					/>
				)}></Autocomplete>
			<Autocomplete
				options={FUELS}
				fullWidth
				noOptionsText='???????????????????? ??????'
				onChange={handleChangeAutocomplete('fuel')}
				value={fuel}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						placeholder='??????????????'
					/>
				)}></Autocomplete>
			<Box marginTop='1em' textAlign='center'>
				<Button onClick={handleClickFind} fullWidth variant='contained'>
					??????????
				</Button>
			</Box>
		</WhiteBox>
	);
};

export default Filters;
