import React from 'react';
import { Box } from '@mui/material';
import { DotsProps } from './types';

export const Dots: React.FC<DotsProps> = ({ scrollSnaps, selectedIndex, onDotClick }) => {
	if (scrollSnaps.length <= 1) return null;

	return (
		<Box
			height={8}
			position={'absolute'}
			bottom={8}
			left={0}
			right={0}
			display={'flex'}
			gap={0.25}
			alignItems={'center'}
			justifyContent={'center'}
		>
			{scrollSnaps.map((_, index) => (
				<Box
					key={index}
					height={8}
					width={8}
					borderRadius={2}
					bgcolor={index === selectedIndex ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)'}
					sx={{
						cursor: 'pointer',
						'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
					}}
					onClick={() => onDotClick(index)}
				/>
			))}
		</Box>
	);
};
