import { ChangeEvent, ReactNode } from 'react';

export type NumberType = {
	id: string;
	placeholder: string;
	type: string;
	disabled: boolean;
	storeInUrl?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type AutocompleteType = {
	id: string;
	name?: string;
	placeholder: string;
	value?: string;
	type: string;
	kind?: 'complex';
	disabled: boolean;
	options: any[];
	storeInUrl?: boolean;
	onChange: (_: any, selected: any) => void;
	onOpen?: () => void;
	onInputChange?: (_: any, value: string) => void;
	noOptionsText?: ReactNode;
};
