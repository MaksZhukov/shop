import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';

export const useCarousel = (options: EmblaOptionsType = {}) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: 'start',
		...options
	});

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const scrollPrev = useCallback(() => {
		emblaApi?.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		emblaApi?.scrollNext();
	}, [emblaApi]);

	const scrollTo = useCallback(
		(index: number) => {
			emblaApi?.scrollTo(index);
		},
		[emblaApi]
	);

	useEffect(() => {
		if (!emblaApi) return;

		const handleSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		};

		const handleReInit = () => {
			setScrollSnaps(emblaApi.scrollSnapList());
			handleSelect();
		};

		handleSelect();
		setScrollSnaps(emblaApi.scrollSnapList());

		emblaApi.on('select', handleSelect);
		emblaApi.on('reInit', handleReInit);

		return () => {
			emblaApi.off('select', handleSelect);
			emblaApi.off('reInit', handleReInit);
		};
	}, [emblaApi]);

	return {
		emblaRef,
		selectedIndex,
		scrollSnaps,
		scrollPrev,
		scrollNext,
		scrollTo
	};
};
