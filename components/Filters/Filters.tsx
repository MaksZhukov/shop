import { Autocomplete, Box, Button, Input, TextField, Typography } from '@mui/material';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import styles from './Filters.module.scss';
import { AutocompleteType, NumberType } from './types';
import classNames from 'classnames';

interface Props {
	fetchData?: (values: { [key: string]: string | null }) => void;
	onClickFind?: (values: { [key: string]: string | null }) => void;
	total: null | number;
	textTotal?: string;
	btn?: ReactNode;
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

const Filters = ({ fetchData, onClickFind, config, btn, textTotal }: Props) => {
	const [values, setValues] = useState<{ [key: string]: string | null }>({});
	const router = useRouter();
	useEffect(() => {
		let newValues: any = {};
		config.forEach((item) => {
			item.forEach((child) => {
				if (router.query[child.id]) {
					newValues[child.id] =
						child.id === 'brand' && Array.isArray((router.query as any)[child.id])
							? (router.query as any)[child.id][0]
							: router.query[child.id];
				}
			});
		});
		setValues(newValues);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.brand]);

	const handleChangeNumberInput = (item: NumberType) => (e: ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [item.id]: e.target.value });
		if (item.storeInUrl) {
			router.query[item.id] = e.target.value;
			router.push({ pathname: router.pathname, query: router.query }, undefined, {
				shallow: true,
			});
		}
		if (item.onChange) {
			item.onChange(e);
		}
	};

	const handleChangeAutocomplete =
		(item: AutocompleteType) => (_: any, selected: { value: string } | string | null) => {
			let selectedValue = typeof selected === 'string' ? selected : selected?.value || null;

			let dependencyItemIds = getDependencyItemIds(config, item);
			let depValues = dependencyItemIds.reduce((prev, key) => ({ ...prev, [key]: null }), {});
			setValues({ ...values, ...depValues, [item.id]: selectedValue });
			if (item.storeInUrl) {
				(router.query as any)[item.id] = selectedValue;
				router.push({ pathname: router.pathname, query: router.query }, undefined, {
					shallow: true,
				});
			}
			if (item.onChange) {
				item.onChange(_, selectedValue);
			}
		};

	const handleClickFind = () => {
		if (onClickFind) {
			onClickFind(values);
		}
		if (fetchData) {
			fetchData(values);
		}
	};
	const renderInput = (item: NumberType) => {
		return (
			<Input
				key={item.id}
				fullWidth
				onChange={handleChangeNumberInput(item)}
				value={router.query[item.id] ?? ''}
				placeholder={item.placeholder}
				type='number'
			></Input>
		);
	};

	const renderAutocomplete = (item: AutocompleteType) => {
		let value = item.options.every((option) => typeof option === 'string')
			? values[item.id]
			: item.options.find((option) => option.value === values[item.id]);
		return (
			<Autocomplete
				key={item.id}
				options={item.options}
				noOptionsText={item.noOptionsText || 'Совпадений нет'}
				onOpen={item.onOpen ? item.onOpen(values) : undefined}
				onChange={handleChangeAutocomplete(item)}
				ListboxProps={{
					role: 'list-box',
					onScroll: item.onScroll,
					className: item.loadingMore ? classNames(styles.list, styles['list_loading-more']) : styles.list,
				}}
				fullWidth
				onInputChange={item.onInputChange}
				classes={{ noOptions: styles['autocomplete__no-options'] }}
				disabled={item.disabledDependencyId === undefined ? false : !values[item.disabledDependencyId]}
				value={value}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							inputProps={{
								...params.inputProps,
								value:
									value?.value && value.label !== params.inputProps.value
										? value.label
										: params.inputProps.value,
							}}
							variant='standard'
							placeholder={item.placeholder}
						/>
					);
				}}
			></Autocomplete>
		);
	};

	return (
		<WhiteBox>
			{config.map((items) => {
				return (
					<Box key={items.map((item) => item.id).toString()} display='flex'>
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
				{btn ? (
					btn
				) : (
					<Button onClick={handleClickFind} fullWidth variant='contained'>
						Найти
					</Button>
				)}
			</Box>
			{textTotal !== null && (
				<Typography textAlign='center' variant='subtitle1' color='primary'>
					{textTotal}
				</Typography>
			)}
		</WhiteBox>
	);
};

export default Filters;
