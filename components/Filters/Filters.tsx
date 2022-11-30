import {
	Autocomplete,
	Box,
	Button,
	Input,
	TextField,
	Typography,
} from '@mui/material';
import WhiteBox from 'components/WhiteBox';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, ReactNode } from 'react';
import styles from './Filters.module.scss';
import { AutocompleteType, NumberType } from './types';

interface Props {
	fetchData?: () => void;
	onClickFind?: () => void;
	total: null | number;
	textTotal?: string;
	btn?: ReactNode;
	config: (AutocompleteType | NumberType)[][];
}

const Filters = ({ fetchData, onClickFind, config, btn, textTotal }: Props) => {
	const router = useRouter();

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
		router.push(
			{ pathname: router.pathname, query: router.query },
			undefined,
			{ shallow: true }
		);
	};

	const handleChangeNumberInput =
		(param: string) => (e: ChangeEvent<HTMLInputElement>) => {
			changeParam({ [param]: e.target.value });
		};

	const handleChangeObjAutocomplete =
		(id: string, name: string) =>
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

	const handleClickFind = () => {
		if (onClickFind) {
			onClickFind();
		}
		if (fetchData) {
			fetchData();
		}
	};
	const renderInput = (item: NumberType) => {
		return (
			<Input
				key={item.id}
				disabled={item.disabled}
				fullWidth
				onChange={item.onChange || handleChangeNumberInput(item.id)}
				value={router.query[item.id] ?? ''}
				placeholder={item.placeholder}
				type='number'></Input>
		);
	};

	const renderAutocomplete = (item: AutocompleteType) => {
		const value = router.isReady
			? router.query[item.id] && router.query[item.name || '']
				? {
						id: router.query[item.id],
						label: router.query[item.name || ''],
				  }
				: router.query[item.id]
			: null;

		return (
			<Autocomplete
				key={item.id + value}
				options={item.options}
				noOptionsText={item.noOptionsText || 'Совпадений нет'}
				onOpen={item.onOpen}
				onChange={
					item.onChange
						? item.onChange
						: item.id && item.name
						? handleChangeObjAutocomplete(item.id, item.name)
						: handleChangeAutocomplete(item.id)
				}
				fullWidth
				classes={{ noOptions: styles['autocomplete__no-options'] }}
				disabled={item.disabled}
				value={
					router.isReady
						? router.query[item.id] && router.query[item.name || '']
							? {
									id: router.query[item.id],
									label: router.query[item.name || ''],
							  }
							: router.query[item.id]
						: null
				}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							variant='standard'
							placeholder={item.placeholder}
						/>
					);
				}}></Autocomplete>
		);
	};

	return (
		<WhiteBox>
			{config.map((items) => {
				return (
					<Box
						key={items.map((item) => item.id).toString()}
						display='flex'>
						{items.map((item) => {
							if (item.type === 'autocomplete') {
								return renderAutocomplete(
									item as AutocompleteType
								);
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
					<Button
						onClick={handleClickFind}
						fullWidth
						variant='contained'>
						Найти
					</Button>
				)}
			</Box>
			{textTotal !== null && (
				<Typography
					textAlign='center'
					variant='subtitle1'
					color='primary'>
					{textTotal}
				</Typography>
			)}
		</WhiteBox>
	);
};

export default Filters;
