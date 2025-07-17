import { AutocompleteProps, Autocomplete as MUIAutocomplete, TextField } from '@mui/material';
import classNames from 'classnames';
import { UIEventHandler, useEffect, useRef, useState } from 'react';

// import VirtualizedListBox from './VirtualizedListBox';
import styles from './Autocomplete.module.scss';
import { usePreviousImmediate } from 'rooks';
import { CustomChevronIcon } from './CustomChevronIcon';
import { ChevronDownIcon } from 'components/Icons';

const Autocomplete = <
	T,
	Multiple extends boolean | undefined = undefined,
	DisableClearable extends boolean | undefined = undefined,
	FreeSolo extends boolean | undefined = undefined
>(
	props: Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> & {
		loadingMore?: boolean;
		required?: boolean;
		onScroll?: UIEventHandler<HTMLUListElement>;
		placeholder?: string;
	}
) => {
	const [isDefaultSet, setIsDefaultSet] = useState(false);
	const [inputValue, setInputValue] = useState<string>('');
	const prevValue = usePreviousImmediate(props.value);
	const previousInputValBeforeReset = useRef<string>('');

	useEffect(() => {
		const value = props.value as { label: string } | string;
		// IT NEEDS TO HANDLE SETUP INPUT VALUE WHEN OPTIONS WERE LOADED AND ONE WAS SELECTED
		if (
			((prevValue === null && value instanceof Object) ||
				(typeof prevValue === 'string' && value instanceof Object)) &&
			!isDefaultSet
		) {
			setInputValue(value.label);
			setIsDefaultSet(true);
		}
	}, [prevValue, props.value, isDefaultSet]);

	return (
		<MUIAutocomplete
			options={props.options}
			noOptionsText={props.noOptionsText || 'Совпадений нет'}
			onOpen={props.onOpen}
			disableClearable={props.disableClearable}
			renderOption={props.renderOption}
			filterOptions={props.filterOptions}
			className={classNames(styles.autocomplete, props.className)}
			onChange={props.onChange}
			popupIcon={<ChevronDownIcon />}
			slotProps={{
				listbox: {
					role: 'list-box',
					onScroll: props.onScroll,
					className: props.loadingMore ? classNames(styles.list, styles['list_loading-more']) : styles.list
				}
			}}
			fullWidth
			inputValue={inputValue}
			onInputChange={(event, value, reason) => {
				// IT NEEDS TO KEEP ORIGINAL VALUE WHEN YOU CHANGE INPUT VALUE AND YOU DON'T HAVE OPTIONS WITH THE VALUE TO USE IT ON BLUR EVENT
				if (reason === 'reset' && value) {
					previousInputValBeforeReset.current = value;
				}
				if (event) {
					const val =
						event.type === 'blur' && !props.options.length ? previousInputValBeforeReset.current : value;
					setIsDefaultSet(true);
					setInputValue(val);
					if (props.onInputChange) {
						props.onInputChange(event, val, reason);
					}
				}
			}}
			classes={{ noOptions: styles['autocomplete__no-options'] }}
			disabled={props.disabled}
			value={props.value}
			renderInput={(params) => {
				return (
					<TextField
						{...params}
						required={props.required}
						variant='standard'
						placeholder={props.placeholder}
					/>
				);
			}}
		></MUIAutocomplete>
	);
};

export default Autocomplete;
