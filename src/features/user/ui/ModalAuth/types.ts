export type ModalAuthStates = 'auth' | 'forgot' | 'reset';

export interface ModalAuthFormProps {
	isLoading: boolean;
	onChangeIsLoading: (value: boolean) => void;
	onChangeType: (type: ModalAuthStates) => void;
	email: string;
	setEmail: (email: string) => void;
}
