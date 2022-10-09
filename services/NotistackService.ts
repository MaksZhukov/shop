import { SnackbarProvider } from 'notistack';

class NotistackService {
	static ref: SnackbarProvider | null;
	static setRef(ref: SnackbarProvider | null) {
		NotistackService.ref = ref;
	}
}

export default NotistackService;
