import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '../../icons';
import { NavigationArrowProps } from './types';

export const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, onClick, axis = 'x', sx, buttonSx }) => {
	const isPrev = direction === 'prev';
	const isVertical = axis === 'y';

	// Choose appropriate icon based on axis and direction
	let Icon;
	if (isVertical) {
		Icon = isPrev ? ChevronUpIcon : ChevronDownIcon;
	} else {
		Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon;
	}

	// Position based on axis and direction
	let position;
	if (isVertical) {
		position = isPrev ? { top: 8 } : { bottom: 8 };
	} else {
		position = isPrev ? { left: 8 } : { right: 8 };
	}

	return (
		<Box
			position={'absolute'}
			{...position}
			sx={{
				...(isVertical
					? { left: '50%', transform: 'translateX(-50%)' }
					: { top: '50%', transform: 'translateY(-50%)' }),
				...sx
			}}
		>
			<IconButton
				sx={{
					backgroundColor: 'rgba(255, 255, 255, 0.4)',
					borderRadius: 2,
					'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
					...buttonSx
				}}
				onClick={onClick}
				aria-label={`${isPrev ? 'Previous' : 'Next'} slide`}
			>
				<Icon />
			</IconButton>
		</Box>
	);
};
