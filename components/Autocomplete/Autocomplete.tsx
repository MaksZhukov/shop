import { Autocomplete as MUIAutocomplete, AutocompleteProps, TextField } from '@mui/material';
import { UIEventHandler } from 'react';

import classNames from 'classnames';

import styles from './Autocomplete.module.scss';

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
    }
) => {
    return (
        <MUIAutocomplete
            options={props.options}
            noOptionsText={props.noOptionsText || 'Совпадений нет'}
            onOpen={props.onOpen}
            className={classNames(styles.autocomplete, props.className)}
            onChange={props.onChange}
            ListboxProps={{
                role: 'list-box',
                onScroll: props.onScroll,
                className: props.loadingMore ? classNames(styles.list, styles['list_loading-more']) : styles.list
            }}
            fullWidth
            onInputChange={props.onInputChange}
            classes={{ noOptions: styles['autocomplete__no-options'] }}
            disabled={props.disabled}
            value={props.value}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        required={props.required}
                        variant="standard"
                        inputProps={{
                            ...params.inputProps,
                            className: classNames(params.inputProps.className, styles.input)
                        }}
                        placeholder={props.placeholder}
                    />
                );
            }}></MUIAutocomplete>
    );
};

export default Autocomplete;
