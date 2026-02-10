import { useCallback, useState } from 'react';
import type { ModalAuthStates } from '../types';

interface UseModalAuthProps {
	onChangeModalOpened: (value: boolean) => void;
	isResetPassword: boolean;
}

export const useModalAuth = ({ onChangeModalOpened, isResetPassword }: UseModalAuthProps) => {
	const [type, setType] = useState<ModalAuthStates>(() => (isResetPassword ? 'reset' : 'auth'));
	const [isLoading, setIsLoading] = useState(false);

	const handleModalClose = useCallback(() => {
		if (!isLoading) onChangeModalOpened(false);
	}, [isLoading, onChangeModalOpened]);

	const formProps = {
		isLoading,
		onChangeIsLoading: setIsLoading,
		onChangeType: setType
	};

	return { type, handleModalClose, formProps };
};
