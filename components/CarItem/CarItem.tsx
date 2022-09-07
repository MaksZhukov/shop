import {
	Card,
	CardContent,
	Button,
	Link,
	Grid,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import styles from './CarItem.module.scss';
import getConfig from 'next/config';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';
import Image from 'next/image';
import Slider from 'react-slick';
import classNames from 'classnames';
import { Car } from 'api/cars/types';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Car;
}

const CarItem = ({ data }: Props) => {
	const router = useRouter();
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

	const handleClickMore = (slug: string) => () => {
		router.push('/awaiting-cars/' + slug);
	};
	let manufactureYear = new Date(data.manufactureDate).getFullYear();

	let name =
		data.brand?.name + ' ' + data.model?.name + ' ' + manufactureYear;

	return (
		<Card className={styles.item}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexDirection: isMobile ? 'column' : 'row',
				}}>
				{data.images && data.images.some((image) => image.formats) ? (
					<Slider
						className={classNames(
							styles.slider,
							isMobile && styles.slider_mobile
						)}
						arrows={false}
						pauseOnHover
						autoplay
						autoplaySpeed={3000}>
						{data.images
							.filter((item) => item.formats)
							.map((item) => (
								<Image
									key={item.id}
									src={
										publicRuntimeConfig.backendLocalUrl +
										`${
											isMobile
												? item.formats?.small.url
												: item.formats?.thumbnail.url
										}`
									}
									width={isMobile ? 500 : 200}
									height={isMobile ? 375 : 150}
									alt={name}></Image>
							))}
					</Slider>
				) : (
					<EmptyImageIcon
						size={isMobile ? 300 : 250}
						margin={
							isMobile ? '-30px auto' : '-25px'
						}></EmptyImageIcon>
				)}
				<CardContent
					sx={{ flex: 1, paddingY: '0!important', width: '100%' }}>
					<Typography
						onClick={handleClickMore(data.slug)}
						lineClamp={1}
						title={name}
						component='div'
						variant='h5'>
						<Link underline='hover'>{name}</Link>
					</Typography>
					<Grid marginBottom='1em' columnSpacing={2} container>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Марка
							</Typography>
							{data.brand?.name}
						</Grid>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Модель
							</Typography>
							{data.model?.name}
						</Grid>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Двигатель
							</Typography>
							{data.engine}
						</Grid>
						<Grid item>
							<Typography
								fontWeight='500'
								component='div'
								variant='subtitle1'>
								Год
							</Typography>
							{manufactureYear}
						</Grid>
					</Grid>
					<Box marginBottom='1em' textAlign='right'>
						<Button
							onClick={handleClickMore(data.slug)}
							variant='outlined'>
							Подробнее
						</Button>
					</Box>
				</CardContent>
			</Box>
		</Card>
	);
};

export default CarItem;
