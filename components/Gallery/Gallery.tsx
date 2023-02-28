import { IconButton, Modal, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import WhiteBox from 'components/WhiteBox';
import { FC, useState } from 'react';
import Image from 'components/Image';
import Typography from 'components/Typography';
import Slider from 'react-slick';
import styles from './Gallery.module.scss';
import { DefaultPage } from 'api/pages/types';
import { Image as IIamge } from 'api/types';
import GalleryImages from 'components/GalleryImages/GalleryImages';

interface Props {
	page: DefaultPage & { images: IIamge[] };
}

const Gallery: FC<Props> = ({ page }) => {
	const [index, setIndex] = useState<number | null>(null);
	const handleClickImage = (i: number) => () => {
		setIndex(i);
	};
	const handleClose = () => {
		setIndex(null);
	};
	return (
		<>
			<Typography component='h1' textTransform='uppercase' variant='h4' textAlign='center' marginBottom='1em'>
				{page.seo?.h1}
			</Typography>
			<Box display='flex' justifyContent='space-around' flexWrap='wrap'>
				{page.images?.map((item, i) => (
					<Box
						width={{ xs: 150, md: 300 }}
						height={{ xs: 115, md: 225 }}
						onClick={handleClickImage(i)}
						sx={{ cursor: 'pointer' }}
						marginBottom='1em'
						key={item.id}
					>
						<Image
							title={item.caption}
							width={300}
							height={225}
							src={item.formats?.small?.url || item.url}
							style={{ maxHeight: '100%' }}
							alt={item.alternativeText}
						></Image>
					</Box>
				))}
			</Box>

			<GalleryImages images={page.images} onClose={handleClose} selectedIndex={index}></GalleryImages>
		</>
	);
};

export default Gallery;
