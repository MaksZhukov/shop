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
		<WhiteBox
			sx={{
				m: 'auto',
				overflow: 'hidden',
				width,
				mb: '1em',
				bgcolor: '#fff',
				position: 'relative'
			}}>
            {data.images ? (
				<Box>
					<Carousel showArrows={false} showDots={false}>
						{data.images?.map((image, i) => (
							<Box key={image.id} sx={{
                                height: 290
                            }}>
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
            <Box sx={{
                p: 1.5
            }}>
				<Typography variant='h6' color='text.secondary' sx={{ fontSize: '20px' }}>
					{title}
				</Typography>
				<Typography color='custom.text-muted' sx={{ mb: 1 }}>
					{[data.volume?.name, data.fuel, data.transmission].filter(Boolean).join(', ')}
				</Typography>
			</Box>
        </WhiteBox>
    );
};
