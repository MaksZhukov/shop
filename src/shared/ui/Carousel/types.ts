import { SxProps } from '@mui/material';
import { EmblaOptionsType } from 'embla-carousel';

export interface CarouselProps {
	children: React.ReactNode;
	onChangeSelectedIndex?: (index: number) => void;
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
	/** Ref for the previous (left/up) NavigationArrow Box root element */
	arrowPrevRef?: React.Ref<HTMLDivElement>;
	/** Ref for the next (right/down) NavigationArrow Box root element */
	arrowNextRef?: React.Ref<HTMLDivElement>;
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
