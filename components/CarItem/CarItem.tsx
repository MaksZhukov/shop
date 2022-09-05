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
	console.log(data);
	const router = useRouter();
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);

	const handleClickMore = (slug: string) => () => {
		router.push('/awaiting-cars/' + slug);
	};

	return (
		<Card sx={{ marginBottom: '2em' }} className={styles.product}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexDirection: isMobile ? 'column' : 'row',
				}}>
				{data.images ? (
					<Slider
						className={classNames(
							styles.slider,
							isMobile && styles.slider_mobile
						)}
						arrows={false}
						pauseOnHover
						autoplay
						autoplaySpeed={3000}>
						{data.images.map((item) => (
							<Image
								key={item.id}
								src={
									publicRuntimeConfig.backendUrl +
									`${
										isMobile
											? item.formats.small.url
											: item.formats.thumbnail.url
									}`
								}
								width={isMobile ? 500 : 200}
								height={isMobile ? 375 : 150}
								alt={data.name}></Image>
						))}
					</Slider>
				) : (
					<EmptyImageIcon size={250} margin='-25px'></EmptyImageIcon>
				)}
				<CardContent sx={{ flex: 1, paddingY: '0!important' }}>
					<Typography
						onClick={handleClickMore(data.slug)}
						lineClamp={1}
						title={data.name}
						component='div'
						variant='h5'>
						<Link underline='hover'>{data.name}</Link>
					</Typography>
					<Grid columnSpacing={2} container>
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
					</Grid>
				</CardContent>
			</Box>
		</Card>
	);
};

export default CarItem;
