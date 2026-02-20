import React, { useEffect, useMemo } from 'react';
import { useCarousel } from './useCarousel';
import { NavigationArrow } from './NavigationArrow';
import { Dots } from './Dots';
import type { CarouselProps } from './types';
import { Box, SxProps } from '@mui/material';
import styles from './Carousel.module.scss';

export const Carousel: React.FC<CarouselProps> = ({
	children,
	sx,
	options = { axis: 'x' },
	showArrows = true,
	showPrevArrow,
	onChangeSelectedIndex,
	showNextArrow,
	showDots = true,
	carouselContainerSx,
	arrowNextButtonSx,
	arrowNextSx,
	arrowPrevButtonSx,
	arrowPrevSx,
	arrowPrevRef,
	arrowNextRef
}) => {
	const { emblaRef, selectedIndex, scrollSnaps, scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext } =
		useCarousel(options);

	useEffect(() => {
		onChangeSelectedIndex?.(selectedIndex);
	}, [selectedIndex, onChangeSelectedIndex]);

	const shouldShowDots = showDots && scrollSnaps.length > 1;

	// Determine which arrows to show - only show if there's overflow and the arrow is enabled
	const shouldShowPrevArrow = (showPrevArrow !== undefined ? showPrevArrow : showArrows) && canScrollPrev;
	const shouldShowNextArrow = (showNextArrow !== undefined ? showNextArrow : showArrows) && canScrollNext;

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
					ref={arrowPrevRef}
					direction='prev'
					onClick={scrollPrev}
					axis={options.axis}
					buttonSx={arrowPrevButtonSx}
					sx={arrowPrevSx}
				/>
			)}
			{shouldShowNextArrow && (
				<NavigationArrow
					ref={arrowNextRef}
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
