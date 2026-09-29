import { reatomComponent } from '@reatom/react';
import { useDI } from '../user.di';
import { ModalAuth } from './ModalAuth';

type AuthModalRootProps = {
	onLoginSuccess: () => Promise<void>;
};

// The one auth modal of the app. Header and footer open it through AuthModalStore.
export const AuthModalRoot = reatomComponent(({ onLoginSuccess }: AuthModalRootProps) => {
	const { authModalStore } = useDI();

	return (
		authModalStore.isOpened() && (
			<ModalAuth
				isResetPassword={authModalStore.isResetPassword()}
				onChangeModalOpened={(isOpened) => authModalStore.isOpened.set(isOpened)}
				onLoginSuccess={onLoginSuccess}
			/>
		)
	);
});
