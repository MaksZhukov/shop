import { Box, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchCar } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import axios from 'axios';
import EmptyImageIcon from 'components/EmptyImageIcon';
import HeadSEO from 'components/HeadSEO';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Slider from 'react-slick';
import styles from './awaiting-car.module.scss';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Car;
}

const CarPage = ({ data }: Props) => {
	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);
	const isMobile = useMediaQuery((theme: any) =>
		theme.breakpoints.down('sm')
	);
	let printOptions = [
		{ text: 'Артикул', value: data.id },
		{ text: 'Марка', value: data.brand?.name },
		{ text: 'Модель', value: data.model?.name },
		{ text: 'Поколение', value: data.generation?.name },
		{ text: 'Тип кузова', value: data.bodyStyle },
		{ text: 'Двигатель', value: data.engine },
		{ text: 'Тип топлива', value: data.fuel },
		{ text: 'Обьем', value: data.volume },
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
	let name =
		data.brand?.name + ' ' + data.model?.name + ' ' + manufactureYear;
	return (
		<>
			<HeadSEO
				title={data.seo?.title || name}
				description={data.seo?.description || `Описание ${name}`}
				keywords={
					data.seo?.keywords ||
					'авто, ожидаемое авто, автомобиль, ожидаемый автомобиль, авто в пути'
				}></HeadSEO>
			<Container>
				<WhiteBox padding='2em'>
					<Typography
						marginBottom='0.5em'
						variant='h4'
						flex='1'
						overflow='hidden'
						title={name}
						textOverflow='ellipsis'
						whiteSpace='nowrap'
						component='h1'>
						{name}
					</Typography>
					<Box
						display='flex'
						sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
						{data.images &&
						data.images.some((item) => item.formats) ? (
							<Slider
								autoplay
								autoplaySpeed={3000}
								dots
								className={styles.slider}>
								{data.images.map((item) => (
									<Image
										key={item.id}
										alt={data.bodyStyle}
										width={640}
										height={480}
										src={
											publicRuntimeConfig.backendLocalUrl +
											item.url
										}></Image>
								))}
							</Slider>
						) : (
							<EmptyImageIcon
								size={isMobile ? 300 : isTablet ? 500 : 700}
								margin={'-8%'}></EmptyImageIcon>
						)}
						<Box flex='1' display='flex'>
							<Box
								flex='1'
								sx={{
									padding: {
										xs: '0',
										md: '0 1em 0 5em',
									},
								}}>
								{printOptions.map((item) => (
									<Box
										display='flex'
										key={item.value?.toString()}>
										<Typography
											mr='1em'
											width='100px'
											fontWeight='500'
											variant='subtitle1'
											component='span'>
											{item.text}:
										</Typography>
										<Typography component='span'>
											{item.value?.toString()}
										</Typography>
									</Box>
								))}
							</Box>
						</Box>
					</Box>
				</WhiteBox>
			</Container>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<
	{},
	{ slug: string }
> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		const response = await fetchCar(context.params?.slug || '', true);

		data = response.data.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			notFound = true;
		}
	}

	return {
		notFound,
		props: { data },
	};
};

export default CarPage;
