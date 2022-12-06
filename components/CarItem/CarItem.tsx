import { Card, CardContent, Button, Link, Grid, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import styles from './CarItem.module.scss';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Slider from 'react-slick';
import classNames from 'classnames';
import { Car } from 'api/cars/types';
import Image from 'components/Image';

interface Props {
	data: Car;
}

const CarItem = ({ data }: Props) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	let manufactureYear = new Date(data.manufactureDate).getFullYear();

	let name = data.brand?.name + ' ' + data.model?.name + ' ' + manufactureYear;

	return (
		<Card className={styles.item}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexDirection: isMobile ? 'column' : 'row',
				}}
			>
				{data.images && data.images.some((image) => image.formats) ? (
					<Slider
						className={classNames(styles.slider, isMobile && styles.slider_mobile)}
						arrows={false}
						pauseOnHover
						autoplay
						autoplaySpeed={3000}
					>
						{data.images
							.filter((item) => item.formats)
							.map((item) => (
								<Image
									key={item.id}
									src={`${
										isMobile
											? item.formats?.small?.url || item.url
											: item.formats?.thumbnail?.url || item.url
									}`}
									width={isMobile ? 500 : 200}
									height={isMobile ? 375 : 150}
									alt={item.alternativeText}
								></Image>
							))}
					</Slider>
				) : (
					<Image src={''} width={isMobile ? 500 : 200} height={isMobile ? 375 : 150} alt={name}></Image>
				)}
				<CardContent sx={{ flex: 1, paddingY: '0!important', width: '100%' }}>
					<Typography lineClamp={1} title={name} component='div' variant='h5'>
						<NextLink href={'/awaiting-cars/' + data.slug} passHref>
							<Link component='span' underline='hover'>
								{name}
							</Link>
						</NextLink>
					</Typography>
					<Grid marginBottom='1em' columnSpacing={2} container>
						<Grid item>
							<Typography fontWeight='500' component='div' variant='subtitle1'>
								Марка
							</Typography>
							{data.brand?.name}
						</Grid>
						<Grid item>
							<Typography fontWeight='500' component='div' variant='subtitle1'>
								Модель
							</Typography>
							{data.model?.name}
						</Grid>
						<Grid item>
							<Typography fontWeight='500' component='div' variant='subtitle1'>
								Двигатель
							</Typography>
							{data.engine}
						</Grid>
						<Grid item>
							<Typography fontWeight='500' component='div' variant='subtitle1'>
								Год
							</Typography>
							{manufactureYear}
						</Grid>
					</Grid>
					<Box marginBottom='1em' textAlign='right'>
						<Button variant='outlined'>
							<NextLink href={'/awaiting-cars/' + data.slug}>Подробнее</NextLink>
						</Button>
					</Box>
				</CardContent>
			</Box>
		</Card>
	);
};

export default CarItem;
