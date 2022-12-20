import { ChangeEvent, ReactNode } from 'react';

export type NumberType = {
	id: string;
	placeholder: string;
	disabledDependencyId?: string;
	type: string;
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
	disabledDependencyId?: string;
	options: any[];
	storeInUrl?: boolean;
	onChange?: (_: any, selected: any) => void;
	onOpen?: (values: { [key: string]: string | null }) => () => void;
	onInputChange?: (_: any, value: string) => void;
	noOptionsText?: ReactNode;
};
