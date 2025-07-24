import React, { useMemo } from 'react';
import { useCarousel } from './useCarousel';
import { NavigationArrow } from './NavigationArrow';
import { Dots } from './Dots';
import { CarouselProps } from './types';
import { Box } from '@mui/material';
import styles from './Carousel.module.scss';

export const Carousel: React.FC<CarouselProps> = ({
	children,
	sx,
	options = { axis: 'x' },
	showArrows = true,
	showPrevArrow,
	showNextArrow,
	showDots = true,
	carouselContainerSx,
	arrowNextButtonSx,
	arrowNextSx,
	arrowPrevButtonSx,
	arrowPrevSx
}) => {
	const { emblaRef, selectedIndex, scrollSnaps, scrollPrev, scrollNext, scrollTo } = useCarousel(options);

	const shouldShowDots = showDots && scrollSnaps.length > 1;

	// Determine which arrows to show
	const shouldShowPrevArrow = showPrevArrow !== undefined ? showPrevArrow : showArrows;
	const shouldShowNextArrow = showNextArrow !== undefined ? showNextArrow : showArrows;

	return (
		<Box height={'100%'} position={'relative'} width={'100%'} sx={sx}>
			<Box overflow={'hidden'} width={'100%'} height={'100%'} ref={emblaRef}>
				<Box
					width={'100%'}
					height={'100%'}
					display={'flex'}
					flexDirection={options.axis === 'x' ? 'row' : 'column'}
					className={styles.carousel__container}
					sx={carouselContainerSx}
				>
					{children}
				</Box>
			</Box>
			{shouldShowPrevArrow && (
				<NavigationArrow
					direction='prev'
					onClick={scrollPrev}
					axis={options.axis}
					buttonSx={arrowPrevButtonSx}
					sx={arrowPrevSx}
				/>
			)}
			{shouldShowNextArrow && (
				<NavigationArrow
					direction='next'
					onClick={scrollNext}
					axis={options.axis}
					buttonSx={arrowNextButtonSx}
					sx={arrowNextSx}
				/>
			)}
			{shouldShowDots && <Dots scrollSnaps={scrollSnaps} selectedIndex={selectedIndex} onDotClick={scrollTo} />}
		</Box>
	);
};
