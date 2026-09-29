import 'reflect-metadata';
import { injectable } from 'inversify';
import type { EnqueueSnackbar } from 'notistack';

@injectable()
export class SnackbarService {
	private enqueue: EnqueueSnackbar | null = null;

	bind(enqueueSnackbar: EnqueueSnackbar) {
		this.enqueue = enqueueSnackbar;
	}

	success(message: string) {
		this.enqueue?.(message, { variant: 'success' });
	}

	error(message: string) {
		this.enqueue?.(message, { variant: 'error' });
	}
}
