import { Box } from '@mui/material';
import type { Car } from 'entities/car';
import { Typography } from 'shared/ui';
import type { CarOnParts } from 'entities/carOnParts';
import { WhiteBox, Carousel } from 'shared/ui';
import { Image } from 'shared/ui';

interface Props {
	dataFieldsToShow?: { name: string; value: string }[];
	activeView?: 'grid' | 'list';
	data: CarOnParts;
	width?: number;
}

export const CarItem = ({ data, width = 342 }: Props) => {
	const title = data.brand?.name + ' ' + data.model?.name + ' ' + data.generation?.name;
	return (
		<WhiteBox margin='auto' overflow={'hidden'} width={width} marginBottom='1em' bgcolor='#fff' position='relative'>
			{data.images ? (
				<Box>
					<Carousel showArrows={false} showDots={false}>
						{data.images?.map((image, i) => (
							<Box key={image.id} height={290}>
								<Image
									title={image.caption}
									width={width}
									height={270}
									style={{
										objectFit: 'cover'
									}}
									alt={image.alternativeText || title}
									src={image.url}
								></Image>
							</Box>
						))}
					</Carousel>
				</Box>
			) : (
				<Box>
					<Image
						title={title}
						style={{
							objectFit: 'cover',
							margin: 'auto'
						}}
						src=''
						width={width}
						height={290}
						alt={title}
					></Image>
				</Box>
			)}

			<Box p={1.5}>
				<Typography variant='h6' fontSize='20px' color='text.secondary'>
					{title}
				</Typography>
				<Typography mb={1} color='custom.text-muted'>
					{[data.volume?.name, data.fuel, data.transmission].filter(Boolean).join(', ')}
				</Typography>
			</Box>
		</WhiteBox>
	);
};
