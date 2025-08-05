import { Box } from '@mui/material';
import { Car } from 'api/cars/types';
import { Typography } from 'components/ui';
import { CarOnParts } from 'api/cars-on-parts/types';
import FavoriteButton from 'components/features/FavoriteButton';
import { WhiteBox, Carousel } from 'components/ui';
import { Product } from 'api/types';
import Image from 'components/features/Image';

interface Props {
	dataFieldsToShow?: { name: string; value: string }[];
	activeView?: 'grid' | 'list';
	data: CarOnParts;
	width?: number;
}

const CarItem = ({ data, width = 342 }: Props) => {
	return (
		<WhiteBox margin='auto' overflow={'hidden'} width={width} marginBottom='1em' bgcolor='#fff' position='relative'>
			<Box position='absolute' zIndex={1} right={1} top={1}>
				<FavoriteButton product={data as unknown as Product}></FavoriteButton>
			</Box>
			{data.images ? (
				<Box>
					<Carousel showArrows={false} showDots={false}>
						{data.images?.map((image) => (
							<Box key={image.id} height={290}>
								<Image
									title={image.caption}
									width={width}
									height={270}
									style={{
										objectFit: 'cover'
									}}
									alt={image.alternativeText}
									src={image.url}
								></Image>
							</Box>
						))}
					</Carousel>
				</Box>
			) : (
				<Box>
					<Image
						title={data.brand?.name + ' ' + data.model?.name + ' ' + data.generation?.name}
						style={{
							objectFit: 'cover',
							margin: 'auto'
						}}
						src=''
						width={width}
						height={290}
						alt={data.brand?.name + ' ' + data.model?.name + ' ' + data.generation?.name}
					></Image>
				</Box>
			)}

			<Box p={1.5}>
				<Typography variant='h6' fontSize='20px' color='text.secondary'>
					{data.brand?.name + ' ' + data.model?.name + ' ' + data.generation?.name}
				</Typography>
				<Typography mb={1} color='custom.text-muted'>
					{[data.volume?.name, data.fuel, data.transmission].filter(Boolean).join(', ')}
				</Typography>
			</Box>
		</WhiteBox>
	);
};

export default CarItem;
