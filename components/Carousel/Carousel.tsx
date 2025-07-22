import React, { useMemo } from 'react';
import { useCarousel } from './useCarousel';
import { NavigationArrow } from './NavigationArrow';
import { Dots } from './Dots';
import { CarouselProps } from './types';
import { Box } from '@mui/material';
import styles from './Carousel.module.scss';

export const Carousel: React.FC<CarouselProps> = ({
	children,
	options = {},
	showArrows = true,
	showDots = true,
	carouselContainerSx
}) => {
	const { emblaRef, selectedIndex, scrollSnaps, scrollPrev, scrollNext, scrollTo } = useCarousel(options);

	const shouldShowDots = showDots && scrollSnaps.length > 1;

	return (
		<Box height={'100%'} position={'relative'} width={'100%'}>
			<Box overflow={'hidden'} width={'100%'} height={'100%'} ref={emblaRef}>
				<Box
					ml={-1}
					width={'100%'}
					height={'100%'}
					display={'flex'}
					className={styles.carousel__container}
					sx={carouselContainerSx}
				>
					{children}
				</Box>
			</Box>
			{showArrows && (
				<>
					<NavigationArrow direction='prev' onClick={scrollPrev} />
					<NavigationArrow direction='next' onClick={scrollNext} />
				</>
			)}
			{shouldShowDots && <Dots scrollSnaps={scrollSnaps} selectedIndex={selectedIndex} onDotClick={scrollTo} />}
		</Box>
	);
};
