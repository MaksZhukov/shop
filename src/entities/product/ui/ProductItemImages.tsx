import { Box } from '@mui/material';
import { Image } from 'shared/ui';
import { Product, getProductLink } from 'entities/product';
import { Carousel } from 'shared/ui/Carousel';
import NextLink from 'next/link';
import { LIMIT_PRODUCT_IMAGES } from '../productConstants';

interface Props {
	data: Product;
	width: number;
	imageHeight: number;
	imageHeightOffset: number;
	disabled?: boolean;
}

export const ProductItemImages = ({ data, width, imageHeight, imageHeightOffset, disabled }: Props) => {
	const disabledStyles = disabled
		? {
				opacity: 0.5,
				cursor: 'not-allowed',
				pointerEvents: 'none' as const
			}
		: {};
	return data.images ? (
		<Box>
			<NextLink href={getProductLink(data)} style={disabledStyles}>
				<Carousel options={{ axis: 'x', loop: false }} showArrows={false} showDots={true}>
					{data.images?.slice(0, LIMIT_PRODUCT_IMAGES).map((image) => (
						<Box key={image.id} maxWidth={'100%'} height={imageHeight + imageHeightOffset}>
							<Image
								title={image.caption}
								width={width}
								height={imageHeight}
								style={{
									objectFit: 'cover'
								}}
								alt={image.alternativeText}
								src={image.url}
							></Image>
						</Box>
					))}
				</Carousel>
			</NextLink>
		</Box>
	) : (
		<Box>
			<NextLink href={getProductLink(data)} style={disabledStyles}>
				<Image
					title={data.h1}
					style={{
						objectFit: 'cover',
						margin: 'auto'
					}}
					src=''
					width={width}
					height={imageHeight + imageHeightOffset}
					alt={data.h1}
				></Image>
			</NextLink>
		</Box>
	);
};
