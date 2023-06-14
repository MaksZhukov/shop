import { Box, Button, Input, Typography } from '@mui/material';
import Autocomplete from 'components/Autocomplete';
import { useRouter } from 'next/router';
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './Filters.module.scss';
import { AutocompleteType, NumberType } from './types';

interface Props {
	onClickFind?: (values: { [key: string]: string | null }) => void;
	total: number | null;
	config: (AutocompleteType | NumberType)[][];
}

const getDependencyItemIds = (
	config: (AutocompleteType | NumberType)[][],
	item: AutocompleteType | NumberType
): string[] => {
	let dependencyItem = config.find((el) => el.find((child) => child.disabledDependencyId === item.id));
	if (dependencyItem) {
		return [dependencyItem[0].id, ...getDependencyItemIds(config, dependencyItem[0])];
	}
	return [];
};

const Filters = ({ onClickFind, config, total }: Props, ref: any) => {
	const [values, setValues] = useState<{ [key: string]: string | null }>({});
	const router = useRouter();
	useEffect(() => {
		let newValues: any = {};
		let [brand, model] = router.query.slug || [];
		config.forEach((item) => {
			item.forEach((child) => {
				if (child.id === 'brand') {
					newValues[child.id] = brand || router.query.brand || null;
				} else if (child.id === 'model') {
					newValues[child.id] = model ? model.replace('model-', '') : router.query.model || null;
				} else if (router.query[child.id]) {
					newValues[child.id] = router.query[child.id];
				}
			});
		});
		setValues(newValues);
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
		setValues({ ...values, [item.id]: e.target.value });
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
			setValues({ ...values, ...depValues, [item.id]: selectedValue });
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
				type='number'></Input>
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
				value={value || null}></Autocomplete>
		);
	};

	return (
		<>
			{config.map((items) => {
				return (
					<Box key={items.map((item) => item.id).toString()} display='flex' marginBottom='1em'>
						{items.map((item) => {
							if (item.type === 'autocomplete') {
								return renderAutocomplete(item as AutocompleteType);
							}
							if (item.type === 'number') {
								return renderInput(item as NumberType);
							}
						})}
					</Box>
				);
			})}
			<Box marginY='1em' textAlign='center'>
				<Button onClick={handleClickFind} fullWidth variant='contained'>
					Найти
				</Button>
			</Box>
			{total !== null && (
				<Typography textAlign='center' variant='subtitle1' color='primary'>
					Найдено: {total}
				</Typography>
			)}
		</>
	);
};

export default forwardRef(Filters);
