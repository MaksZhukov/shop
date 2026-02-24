import { Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { Image } from 'shared/ui';
import { Carousel } from 'shared/ui';
import type { Product } from 'entities/product';

interface Props {
	images: Product['images'];
	currentImageIndex: number;
	onImageClick: (index: number) => void;
	onImageSelect: (index: number) => void;
}

export const ProductImages = ({ images, currentImageIndex, onImageClick, onImageSelect }: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	if (!images || images.length === 0) {
		return null;
	}

	return (
		<>
			{/* Desktop thumbnail carousel */}
			<Box width={56} display={{ xs: 'none', md: 'block' }} height={255}>
				<Carousel
					showNextArrow={images.length > 5}
					showPrevArrow={false}
					options={{ axis: 'y' }}
					carouselContainerSx={{ mt: -1 }}
					showDots={false}
					arrowNextSx={{ bottom: -48 }}
					arrowNextButtonSx={{ width: 56 }}
				>
					{images.map((item, i) => (
						<Box
							borderRadius={'6px'}
							onClick={() => onImageSelect(i)}
							key={item.id}
							width={56}
							height={52}
							pt={1}
							sx={{ cursor: 'pointer' }}
						>
							<Image
								src={item.url}
								alt={item.alternativeText}
								width={56}
								height={44}
								style={{
									borderRadius: '4px',
									objectFit: 'cover',
									border: currentImageIndex === i ? `2px solid ${theme.palette.text.primary}` : 'none'
								}}
							/>
						</Box>
					))}
				</Carousel>
			</Box>

			{/* Mobile carousel */}
			{isMobile ? (
				<Carousel carouselContainerSx={{ ml: -1 }} showArrows={false} showDots={true}>
					{images.map((item, i) => (
						<Box pl={1} width={'90%'} height={280} key={item.id}>
							<Image
								src={item.url}
								alt={item.alternativeText}
								width={300}
								height={256}
								style={{ borderRadius: '16px', objectFit: 'cover', width: '100%' }}
							/>
						</Box>
					))}
				</Carousel>
			) : (
				/* Desktop main image */
				<Box onClick={() => onImageClick(currentImageIndex)} sx={{ cursor: 'pointer' }}>
					<Image
						src={images[currentImageIndex]?.url}
						alt={images[currentImageIndex]?.alternativeText}
						width={632}
						height={505}
						style={{
							borderRadius: '16px',
							objectFit: 'cover'
						}}
					/>
				</Box>
			)}
		</>
	);
};
