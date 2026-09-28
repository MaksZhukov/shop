import { type Context, useContext } from 'react';

export const useStrictContext = <Value>(context: Context<Value | null>): Value => {
	const value = useContext(context);
	if (!value) {
		throw new Error('useStrictContext must be used within its Provider');
	}
	return value;
};
