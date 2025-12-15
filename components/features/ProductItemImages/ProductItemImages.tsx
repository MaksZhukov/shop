import { Box } from '@mui/material';
import Image from 'components/features/Image';
import { Product } from 'api/types';
import { Carousel } from 'shared/ui/Carousel';
import NextLink from 'next/link';

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
			<NextLink href={`/spare-parts/${data.brand?.slug}/${data.id}`} style={disabledStyles}>
				<Carousel options={{ axis: 'x', loop: false }} showArrows={false} showDots={true}>
					{data.images?.map((image) => (
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
			<NextLink href={`/spare-parts/${data.brand?.slug}/${data.id}`} style={disabledStyles}>
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
