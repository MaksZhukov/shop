import 'reflect-metadata';
import { atom, reatomBoolean, withConnectHook } from '@reatom/core';
import { injectable } from 'inversify';

const RESET_PASSWORD_PARAM = 'code';

const hasResetPasswordCode = () =>
	typeof window !== 'undefined' && new URLSearchParams(window.location.search).has(RESET_PASSWORD_PARAM);

@injectable()
export class AuthModalStore {
	readonly isResetPassword = atom(false, 'authModal.isResetPassword');
	// Checked when the modal root first subscribes, after hydration: a reset link from the email opens the modal.
	readonly isOpened = reatomBoolean(false, 'authModal.isOpened').extend(
		withConnectHook((target) => {
			if (hasResetPasswordCode()) {
				this.isResetPassword.set(true);
				target.setTrue();
			}
		})
	);

	open() {
		this.isOpened.setTrue();
	}
}
