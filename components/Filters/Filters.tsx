import { Autocomplete, Box, Button, Input, TextField } from '@mui/material';
import { getBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { getModels } from 'api/models/models';
import { Model } from 'api/models/types';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';

interface Props {
	fetchProducts: () => void;
}

const Filters = ({ fetchProducts }: Props) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const router = useRouter();

	const {
		min = '',
		max = '',
		brandName = '',
		brandId = '',
		modelId = '',
		modelName = '',
	} = router.query as {
		min: string;
		max: string;
		brandName: string;
		brandId: string;
		modelName: string;
		modelId: string;
	};

	const handleOpenBrandAutocomplete = async () => {
		if (!brands.length) {
			const {
				data: { data },
			} = await getBrands({});
			setBrands(data);
		}
	};

	const handleOpenModelAutocomplete = async () => {
		if (!models.length) {
			const {
				data: { data },
			} = await getModels({ filters: { brand: brandId } });
			setModels(data);
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
			<Box marginTop='1em' textAlign='center'>
				<Button onClick={handleClickFind} fullWidth variant='contained'>
					Найти
				</Button>
			</Box>
		</WhiteBox>
	);
};

export default Filters;
