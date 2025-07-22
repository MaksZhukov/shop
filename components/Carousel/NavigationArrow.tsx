import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { NavigationArrowProps } from './types';

export const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, onClick }) => {
	const isPrev = direction === 'prev';
	const Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon;
	const position = isPrev ? { left: 8 } : { right: 8 };

	return (
		<Box position={'absolute'} top={'50%'} sx={{ transform: 'translateY(-50%)', ...position }}>
			<IconButton
				sx={{
					backgroundColor: 'rgba(255, 255, 255, 0.4)',
					borderRadius: 2,
					'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
				}}
				onClick={onClick}
				aria-label={`${isPrev ? 'Previous' : 'Next'} slide`}
			>
				<Icon />
			</IconButton>
		</Box>
	);
};
