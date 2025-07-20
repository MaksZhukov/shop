import { useState } from 'react';

interface WorkTimetableState {
	anchorEl: HTMLElement | null;
	isOpen: boolean;
}

export const useWorkTimetableState = () => {
	const [state, setState] = useState<WorkTimetableState>({
		anchorEl: null,
		isOpen: false
	});

	const setAnchorEl = (anchorEl: HTMLElement | null) => {
		setState((prev) => ({ ...prev, anchorEl }));
	};

	const setIsOpen = (isOpen: boolean) => {
		setState((prev) => ({ ...prev, isOpen }));
	};

	const handleClose = () => {
		setState({ anchorEl: null, isOpen: false });
	};

	return {
		...state,
		setAnchorEl,
		setIsOpen,
		handleClose
	};
};
