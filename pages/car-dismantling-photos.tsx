import { Box, IconButton, Modal } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPageCarDismantlingPhotos } from 'api/pageCarDismantlingPhotos/pageCarDismantlingPhotos';
import { PageCarDismantlingPhotos } from 'api/pageCarDismantlingPhotos/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import SEOBox from 'components/SEOBox';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import Slider from 'react-slick';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import styles from './car-dismantling-photos.module.scss';
interface Props {
	page: PageCarDismantlingPhotos;
}

const CarDismantlingPhotos: NextPage<Props> = ({ page }) => {
	const [index, setIndex] = useState<number | null>(null);
	const handleClickImage = (i: number) => () => {
		setIndex(i);
	};
	const handleClose = () => {
		setIndex(null);
	};
	return (
		<>
			<WhiteBox>
				<Typography component='h1' variant='h4' textAlign='center' gutterBottom>
					{page.seo?.h1 || 'Фото разборки'}
				</Typography>
				<Box display='flex' justifyContent='space-around' flexWrap='wrap'>
					{page.images?.map((item, i) => (
						<Box onClick={handleClickImage(i)} sx={{ cursor: 'pointer' }} marginBottom='1em' key={item.id}>
							<Image
								width={300}
								height={225}
								src={item.formats?.small.url || item.url}
								alt={item.alternativeText}
							></Image>
						</Box>
					))}
				</Box>
			</WhiteBox>
			<Modal open={index !== null} onClose={handleClose}>
				<Box padding='0 50px' marginTop='25%' sx={{ transform: 'translateY(-50%)' }}>
					<IconButton
						size='large'
						color='primary'
						sx={{
							position: 'absolute',
							top: '-25%',
							right: '20px',
							opacity: 0.75,
						}}
						onClick={handleClose}
						aria-label='close'
					>
						<CloseIcon sx={{ color: '#fff' }} fontSize='large' />
					</IconButton>
					<Slider className={styles.slider} slidesToShow={1} initialSlide={index as number}>
						{page.images?.map((item) => (
							<Image
								key={item.id}
								width={640}
								height={480}
								src={item.formats?.small.url || item.url}
								alt={item.alternativeText}
							></Image>
						))}
					</Slider>
				</Box>
			</Modal>
		</>
	);
};

export default CarDismantlingPhotos;

export const getStaticProps = getPageProps(fetchPageCarDismantlingPhotos);
