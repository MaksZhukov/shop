import { AutocompleteInputChangeReason, Box, Button, Input, Typography } from '@mui/material';
import Autocomplete from 'components/Autocomplete';
import { useRouter } from 'next/router';
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './Filters.module.scss';
import { AutocompleteType, NumberType } from './types';
import WhiteBox from 'components/WhiteBox';
import { ChevronUpIcon, ChevronDownIcon } from 'components/Icons';

interface Props {
	onClickFind?: (values: { [key: string]: string | null }) => void;
	total: number | null;
	values: { [key: string]: string | null };
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	config: (AutocompleteType | NumberType)[];
}

const getDependencyItemIds = (
	config: (AutocompleteType | NumberType)[],
	item: AutocompleteType | NumberType
): string[] => {
	let dependencyItem = config.find((child) => child.disabledDependencyId === child.id);
	if (dependencyItem) {
		return [dependencyItem.id, ...getDependencyItemIds(config, dependencyItem)];
	}
	return [];
};

const Filters = ({ onClickFind, config, total, values, onChangeFilterValues }: Props, ref: any) => {
	const router = useRouter();
	const [isMoreFilters, setIsMoreFilters] = useState(false);
	useEffect(() => {
		let newValues: any = {};
		let [brand, model] = router.query.slug || [];
		config.forEach((child) => {
			if (child.id === 'brand') {
				newValues[child.id] = brand || router.query.brand || null;
			} else if (child.id === 'model') {
				newValues[child.id] = model ? model.replace('model-', '') : router.query.model || null;
			} else if (router.query[child.id]) {
				newValues[child.id] = router.query[child.id];
			}
		});
		console.log(newValues);
		onChangeFilterValues(newValues);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.slug]);

	const handleClickFind = () => {
		if (onClickFind) {
			onClickFind(values);
		}
	};

	useImperativeHandle(ref, () => ({
		onClickFind: handleClickFind
	}));

	const handleChangeNumberInput = (item: NumberType) => (e: ChangeEvent<HTMLInputElement>) => {
		onChangeFilterValues({ ...values, [item.id]: e.target.value });
		if (item.storeInUrl) {
			router.query[item.id] = e.target.value;
			router.push({ pathname: router.pathname, query: router.query }, undefined, {
				shallow: true
			});
		}
		if (item.onChange) {
			item.onChange(e);
		}
	};

	const handleChangeAutocomplete =
		(item: AutocompleteType) => (_: any, selected: { value: string } | string | null) => {
			let selectedValue =
				typeof selected === 'string' || typeof selected === 'number' ? selected : selected?.value || null;
			let dependencyItemIds = getDependencyItemIds(config, item);
			let depValues = dependencyItemIds.reduce((prev, key) => ({ ...prev, [key]: null }), {});
			onChangeFilterValues({ ...values, ...depValues, [item.id]: selectedValue });
			if (item.storeInUrl) {
				(router.query as any)[item.id] = selectedValue;
				router.push({ pathname: router.pathname, query: router.query }, undefined, {
					shallow: true
				});
			}
			if (item.onChange) {
				item.onChange(_, selectedValue);
			}
		};

	const renderInput = (item: NumberType) => {
		return (
			<Input
				key={item.id}
				fullWidth
				sx={{ bgcolor: '#fff', padding: '0 1em' }}
				onChange={handleChangeNumberInput(item)}
				value={values[item.id]}
				placeholder={item.placeholder}
				type='number'
			></Input>
		);
	};

	const renderAutocomplete = (item: AutocompleteType) => {
		let value = null;

		if (values[item.id]) {
			if ((item.id === 'kindSparePart' || item.id === 'generation') && !item.options.length) {
				value = null;
			} else if (item.options.every((option) => typeof option === 'string' || typeof option === 'number')) {
				value = values[item.id];
			} else {
				value = item.options.find((option) => option.value === values[item.id]);
			}
		}

		return (
			<Autocomplete
				key={item.id}
				options={item.options}
				noOptionsText={item.noOptionsText}
				onOpen={item.onOpen ? item.onOpen(values) : undefined}
				onChange={handleChangeAutocomplete(item)}
				onScroll={item.onScroll}
				onInputChange={item.onInputChange}
				placeholder={item.placeholder}
				classes={{ input: styles.input }}
				disabled={item.disabledDependencyId === undefined ? false : !values[item.disabledDependencyId]}
				value={value || null}
			></Autocomplete>
		);
	};
	const mainFiltersConfig = config.filter((item) => item.category === 'main');
	const additionalFiltersConfig = config.filter((item) => item.category === 'additional');

	const renderFilterItem = (item: AutocompleteType | NumberType) => (
		<Box key={item.id} display='flex' marginBottom={1}>
			{item.type === 'autocomplete' && renderAutocomplete(item as AutocompleteType)}
			{item.type === 'number' && renderInput(item as NumberType)}
		</Box>
	);

	return (
		<WhiteBox p={2} withShadow>
			{mainFiltersConfig.map(renderFilterItem)}
			{isMoreFilters && additionalFiltersConfig.map(renderFilterItem)}
			<Button
				size='small'
				sx={{ alignSelf: 'flex-start', mb: 2, px: 1 }}
				onClick={() => setIsMoreFilters(!isMoreFilters)}
				endIcon={isMoreFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
			>
				{isMoreFilters ? 'Меньше параметров' : 'Больше параметров'}
			</Button>
			<Button onClick={handleClickFind} fullWidth variant='contained'>
				Показать {total}
			</Button>
		</WhiteBox>
	);
};

export default forwardRef(Filters);
