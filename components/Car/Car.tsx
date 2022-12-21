import { Box } from '@mui/system';
import { CarOnParts } from 'api/cars-on-parts/types';
import { Car as ICar } from 'api/cars/types';
import Image from 'components/Image';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { FC } from 'react';
import ReactPlayer from 'react-player';
import Slider from 'react-slick';
import { isCarOnsPartParts } from 'services/CarsService';
import styles from './Car.module.scss';

interface Props {
	data: ICar | CarOnParts;
}

const Car: FC<Props> = ({ data }) => {
	let printOptions = [
		{ text: 'Артикул', value: data.id },
		{ text: 'Марка', value: data.brand?.name },
		{ text: 'Модель', value: data.model?.name },
		{ text: 'Поколение', value: data.generation?.name },
		{ text: 'Тип кузова', value: data.bodyStyle },
		{ text: 'Коробка', value: data.transmission },
		{ text: 'Двигатель', value: data.engine },
		{ text: 'Тип топлива', value: data.fuel },
		{ text: 'Обьем', value: data.volume?.name },
		{
			text: 'Год',
			value: data.manufactureDate,
		},
		{
			text: 'Дата поставки',
			value: data.deliveryDate,
		},
		{ text: 'Пробег', value: data.mileage },
	];

	let manufactureYear = new Date(data.manufactureDate).getFullYear();
	let name = data.brand?.name + ' ' + data.model?.name + ' ' + manufactureYear;
	return (
		<WhiteBox padding='2em'>
			<Typography
				marginBottom='0.5em'
				variant='h4'
				flex='1'
				overflow='hidden'
				title={name}
				textOverflow='ellipsis'
				whiteSpace='nowrap'
				component='h1'
			>
				{data.seo?.h1 || name}
			</Typography>
			<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				{data.images && data.images.some((item) => item.formats) ? (
					<Slider autoplay autoplaySpeed={3000} dots className={styles.slider}>
						{data.images.map((item) => (
							<Image
								key={item.id}
								alt={item.alternativeText}
								width={640}
								height={480}
								src={item.url}
							></Image>
						))}
					</Slider>
				) : (
					<Image alt={name} width={640} height={480} src=''></Image>
				)}
				<Box flex='1' display='flex'>
					<Box
						flex='1'
						sx={{
							padding: {
								xs: '0',
								md: '0 1em 0 5em',
							},
						}}
					>
						{printOptions.map((item) => (
							<Box display='flex' key={item.value?.toString()}>
								<Typography
									mr='1em'
									width='100px'
									fontWeight='500'
									variant='subtitle1'
									component='span'
								>
									{item.text}:
								</Typography>
								<Typography component='span'>{item.value?.toString()}</Typography>
							</Box>
						))}
						{isCarOnsPartParts(data) && (
							<Typography marginTop='1em' fontWeight='bold' variant='body1' color='primary'>
								{data.price} руб{' '}
								{!!data.priceUSD && (
									<Typography color='text.secondary' component='sup'>
										(~{data.priceUSD.toFixed()}$)
									</Typography>
								)}
							</Typography>
						)}
					</Box>
				</Box>
			</Box>
			{isCarOnsPartParts(data) && (
				<Typography mt='0.5em' variant='body1'>
					<Typography fontWeight='500' component='span' variant='subtitle1'>
						Описание:
					</Typography>{' '}
					{data.description}
				</Typography>
			)}
			{data.videoLink && <ReactPlayer url={data.videoLink}></ReactPlayer>}
		</WhiteBox>
	);
};

export default Car;
