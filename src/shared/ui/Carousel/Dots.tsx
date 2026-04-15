import React from 'react';
import { Box } from '@mui/material';
import type { DotsProps } from './types';

export const Dots: React.FC<DotsProps> = ({ scrollSnaps, selectedIndex, onDotClick }) => {
	if (scrollSnaps.length <= 1) return null;

	const handleDotClick = (index: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onDotClick(index);
	};

	return (
        <Box
            sx={{
                height: 12,
                position: 'absolute',
                bottom: 4,
                left: 0,
                right: 0,
                display: 'flex',
                gap: 0.25,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {scrollSnaps.map((_, index) => (
				<Box
                    key={index}
                    onClick={handleDotClick(index)}
                    sx={{
                        height: 8,
                        width: 8,
                        borderRadius: 2,
                        bgcolor: index === selectedIndex ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                    }} />
			))}
        </Box>
    );
};
