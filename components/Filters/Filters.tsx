import { Autocomplete, Box, Button, Input, TextField, Typography } from '@mui/material';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './Filters.module.scss';
import { AutocompleteType, NumberType } from './types';

interface Props {
	fetchData?: (values: any) => void;
	onClickFind?: (values: any) => void;
	total: null | number;
	textTotal?: string;
	btn?: ReactNode;
	config: (AutocompleteType | NumberType)[][];
}

const Filters = ({ fetchData, onClickFind, config, btn, textTotal }: Props) => {
	const [values, setValues] = useState<any>({});
	const router = useRouter();
	useEffect(() => {
		let newValues: any = {};
		config.forEach((item) => {
			item.forEach((child) => {
				if (router.query[child.id]) {
					newValues[child.id] = Array.isArray(router.query[child.id])
						? (router.query as any)[child.id][0]
						: router.query[child.id];
				}
			});
		});
		setValues(newValues);
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

	const handleChangeAutocomplete = (item: AutocompleteType) => (_: any, selected: string | null) => {
		setValues({ ...values, [item.id]: selected });
		if (item.storeInUrl) {
			(router.query as any)[item.id] = selected;
			router.push({ pathname: router.pathname, query: router.query }, undefined, {
				shallow: true,
			});
		}
		if (item.onChange) {
			item.onChange(_, selected);
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
		return (
			<Autocomplete
				key={item.id + values[item.id]}
				options={item.options}
				noOptionsText={item.noOptionsText || 'Совпадений нет'}
				onOpen={item.onOpen}
				onChange={handleChangeAutocomplete(item)}
				fullWidth
				onInputChange={item.onInputChange}
				classes={{ noOptions: styles['autocomplete__no-options'] }}
				disabled={item.disabledDependencyId === undefined ? false : !values[item.disabledDependencyId]}
				value={values[item.id]}
				renderInput={(params) => {
					return <TextField {...params} variant='standard' placeholder={item.placeholder} />;
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
