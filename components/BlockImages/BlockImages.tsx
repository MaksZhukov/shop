import { Box, SxProps } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/features/Image';
import { FC } from 'react';
import Slider from 'react-slick';
import styles from './BlockImages.module.scss';

interface Props {
	images?: IImage[];
	isOnSSR?: boolean;
	withSlider?: boolean;
	withoutOverlay?: boolean;
	sx?: SxProps<any>;
}

const BlockImages: FC<Props> = ({ images, withoutOverlay = false, withSlider = false, sx }) => {
	if (!images) {
		return <></>;
	}
	if (withSlider) {
		return (
			<Box paddingX='1em'>
				<Slider slidesToShow={1}>
					{images.map((item) => (
						<Box key={item.id} padding='0.5em'>
							<Image
								title={item.caption}
								alt={item.alternativeText}
								width={390}
								height={270}
								style={{ height: '270px', objectFit: 'cover', margin: 'auto' }}
								src={item.formats?.small?.url || item.url}
							></Image>
						</Box>
					))}
				</Slider>
			</Box>
		);
	}
	return (
		<Box
			className={withoutOverlay ? '' : styles.overlay}
			paddingY='3em'
			marginY='3em'
			display='flex'
			gap={'1em'}
			sx={sx}
		>
			{images.map((item) => (
				<Box key={item.id}>
					<Image
						title={item.caption}
						src={item.url}
						alt={item.alternativeText}
						width={390}
						height={270}
						style={{ height: '100%', objectFit: 'cover' }}
					></Image>
				</Box>
			))}
		</Box>
	);
};

export default BlockImages;
