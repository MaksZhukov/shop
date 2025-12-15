import { SxProps } from '@mui/material';
import { EmblaOptionsType } from 'embla-carousel';

export interface CarouselProps {
	children: React.ReactNode;
	options?: EmblaOptionsType;
	showArrows?: boolean;
	showPrevArrow?: boolean;
	showNextArrow?: boolean;
	showDots?: boolean;
	sx?: SxProps;
	arrowNextButtonSx?: SxProps;
	arrowNextSx?: SxProps;
	arrowPrevButtonSx?: SxProps;
	arrowPrevSx?: SxProps;
	carouselContainerSx?: SxProps;
}

export interface NavigationArrowProps {
	direction: 'prev' | 'next';
	onClick: () => void;
	axis?: 'x' | 'y';
	sx?: SxProps;
	buttonSx?: SxProps;
}

export interface DotsProps {
	scrollSnaps: number[];
	selectedIndex: number;
	onDotClick: (index: number) => void;
}

export interface CarouselContainerProps {
	children: React.ReactNode;
	emblaRef: (node: HTMLDivElement | null) => void;
	className?: string;
}
