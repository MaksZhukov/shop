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
import getConfig from 'next/config';
import { getPageProps } from 'services/PagePropsService';
import Slider from 'react-slick';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import styles from './car-dismantling-photos.module.scss';
const { publicRuntimeConfig } = getConfig();
interface Props {
	data: PageCarDismantlingPhotos;
}


const CarDismantlingPhotos: NextPage<Props> = ({ data }) => {
	const [index, setIndex] = useState<number | null>(null);
	const handleClickImage = (i: number) => () => {
		setIndex(i);
	};
	const handleClose = () => {
		setIndex(null);
	};
	return (
		<>
			<HeadSEO
				description={data.seo?.description}
				title={data.seo.title}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography
						component='h1'
						variant='h4'
						textAlign='center'
						gutterBottom>
						{data.seo?.h1 || 'Фото разборки'}
					</Typography>
					<Box
						display='flex'
						justifyContent='space-around'
						flexWrap='wrap'>
						{data.images?.map((item, i) => (
							<Box
								onClick={handleClickImage(i)}
								sx={{ cursor: 'pointer' }}
								marginBottom='1em'
								key={item.id}>
								<Image
									width={300}
									height={225}
									src={
										publicRuntimeConfig.backendLocalUrl +
										item.formats?.small.url
									}
									alt={item.alternativeText}></Image>
							</Box>
						))}
					</Box>
				</WhiteBox>
				<Modal open={index !== null} onClose={handleClose}>
					<Box
						padding='0 50px'
						marginTop='25%'
						sx={{ transform: 'translateY(-50%)' }}>
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
							aria-label='close'>
							<CloseIcon
								sx={{ color: '#fff' }}
								fontSize='large'
							/>
						</IconButton>
						<Slider
							className={styles.slider}
							slidesToShow={1}
							initialSlide={index as number}>
							{data.images?.map((item) => (
								<Image
									key={item.id}
									width={640}
									height={480}
									src={
										publicRuntimeConfig.backendLocalUrl +
										item.formats?.small.url
									}
									alt={item.alternativeText}></Image>
							))}
						</Slider>
					</Box>
				</Modal>
				<SEOBox
					content={data.seo.content}
					images={data.seo.images}></SEOBox>
			</Container>
		</>
	);
};

export default CarDismantlingPhotos;

export const getStaticProps = getPageProps(fetchPageCarDismantlingPhotos);
