import { SxProps } from '@mui/material';
import { EmblaOptionsType } from 'embla-carousel';

export interface CarouselProps {
	children: React.ReactNode;
	options?: EmblaOptionsType;
	showArrows?: boolean;
	showDots?: boolean;
	carouselContainerSx?: SxProps;
}

export interface NavigationArrowProps {
	direction: 'prev' | 'next';
	onClick: () => void;
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
