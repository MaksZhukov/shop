import { SnackbarCloseReason } from '@mui/material';
import { makeAutoObservable } from 'mobx';
import { ReactElement, ReactNode } from 'react';
import RootStore from '.';

interface Notification {
	timerId: null | number;
	open?: boolean;
	message: ReactNode;
	content?: ReactElement;
	onClose?: (
		event: React.SyntheticEvent<any> | Event,
		reason: SnackbarCloseReason
	) => void;
}

export default class NotificationStore implements Notification {
	root: RootStore;

	timerId: null | number = null;
	open: boolean = false;
	message: ReactNode = '';
	content?: ReactElement | undefined;
	onClose?: (
		event: React.SyntheticEvent<any> | Event,
		reason: SnackbarCloseReason
	) => void | undefined;

	constructor(root: RootStore) {
		this.root = root;
		makeAutoObservable(this);
	}
	showMessage({
		message,
		onClose,
		content,
		timeout = 2000,
	}: {
		message?: string;
		timeout?: number;
		onClose?: () => void;
		content?: ReactElement;
	}) {
		this.open = true;
		this.message = message;
		this.content = content;
		this.onClose = onClose;
		if (this.timerId) {
			clearTimeout(this.timerId);
		}
		this.timerId = window.setTimeout(() => {
			this.closeMessage();
		}, timeout);
	}
	closeMessage() {
		this.open = false;
	}
}
