import { FC, ReactNode } from 'react';
import { Provider } from 'mobx-react';
import { store } from 'store';

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};
