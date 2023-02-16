import { Box, Container, SxProps } from '@mui/system';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import { FC } from 'react';
import styles from './BlockImages.module.scss';
import { useMediaQuery } from '@mui/material';

interface Props {
	images?: IImage[];
	isOnSSR?: boolean;
	withoutOverlay?: boolean;
	sx?: SxProps<any>;
}

const BlockImages: FC<Props> = ({ images, withoutOverlay = false, sx }) => {
	if (!images) {
		return <></>;
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
						style={{ height: 'auto' }}
					></Image>
				</Box>
			))}
		</Box>
	);
};

export default BlockImages;
