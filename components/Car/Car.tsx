import { Link, Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { Car as ICar } from 'api/cars/types';
import classNames from 'classnames';
import Image from 'components/features/Image';
import Typography from 'components/ui/Typography';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import Slider from 'react-slick';
import styles from './Car.module.scss';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	data: ICar;
}

const Car: FC<Props> = ({ data }) => {
	const [sliderBig, setSliderBig] = useState<Slider | null>(null);
	const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
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
			value: data.manufactureDate
		},
		{
			text: 'Дата поставки',
			value: data.deliveryDate
		},
		{ text: 'Пробег', value: data.mileage }
	];

	const getSlidesToShow = () => {
		const videoLinkPlus = data.videoLink ? 1 : 0;
		if (isMobile) {
			return data.images?.length === 1 ? 1 + videoLinkPlus : 2 + videoLinkPlus;
		}
		return data.images && data.images.length >= 5 ? 4 + videoLinkPlus : (data.images?.length || 0) + videoLinkPlus;
	};

	return (
		<>
			<Box display='flex' marginTop='3em' gap={'2em'} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				<Box>
					<Box display='flex' sx={{ width: { xs: '100%', md: '570px' } }} maxHeight={isMobile ? 360 : 480}>
						{data.images ? (
							<>
								<Slider
									ref={(ref) => {
										setSliderSmall(ref);
									}}
									swipeToSlide
									verticalSwiping
									vertical
									arrows={false}
									autoplay
									slidesToShow={getSlidesToShow()}
									focusOnSelect
									className={classNames(
										styles.slider,
										styles.slider_small,
										isMobile && styles.slider_small_mobile
									)}
									asNavFor={sliderBig || undefined}
								>
									{data.images.map((item) => (
										<Box marginY='0.5em' key={item.id}>
											<Image
												title={item.caption}
												alt={item.alternativeText || item.name}
												width={104}
												height={78}
												src={item.formats?.thumbnail.url || item.url}
											></Image>
										</Box>
									))}
									{data.videoLink && (
										<Box>
											<Typography
												width={98}
												bgcolor='primary.main'
												height={98}
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												Видео
											</Typography>
										</Box>
									)}
								</Slider>
								<Slider
									ref={(ref) => {
										setSliderBig(ref);
									}}
									asNavFor={sliderSmall || undefined}
									arrows={false}
									autoplaySpeed={5000}
									className={classNames(styles.slider, isMobile && styles.slider_mobile)}
								>
									{data.images.map((item) => (
										<Box paddingX={'1em'} key={item.id}>
											<Image
												// style={{ height: '100%' }}
												title={item.caption}
												alt={item.alternativeText || item.name}
												width={440}
												height={isMobile ? 360 : 480}
												src={item.url}
											></Image>
										</Box>
									))}
									{data.videoLink && (
										<Box>
											<ReactPlayer
												onPlay={() => sliderSmall?.slickPause()}
												onPause={() => sliderSmall?.slickPlay()}
												onEnded={() => sliderSmall?.slickPlay()}
												controls
												style={{ height: '100%' }}
												width={'100%'}
												height={isMobile ? '100%' : 480}
												src={data.videoLink}
											></ReactPlayer>
										</Box>
									)}
								</Slider>
							</>
						) : (
							<Image
								title={data.name}
								alt={data.name}
								quality={100}
								width={540}
								height={360}
								style={{ objectFit: 'cover' }}
								src=''
							></Image>
						)}
					</Box>
				</Box>

				<Box flex='1'>
					<Typography variant='h4' fontWeight='500' title={data.name} component='h1'>
						{data.name}
					</Typography>
					<Box marginBottom='1em' alignItems='center' display='flex'>
						<Link marginRight='0.5em' variant='h6' href='tel:+375297804780'>
							+375 29 780 4 780
						</Link>
					</Box>

					<Table sx={{ marginY: '2em' }}>
						<TableBody>
							{printOptions.map((item) => (
								<TableRow key={item.value as string}>
									<TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding='none'>
										<Typography whiteSpace='nowrap' fontWeight='500'>
											{item.text}
										</Typography>
									</TableCell>
									<TableCell width='100%' sx={{ border: 'none', paddingLeft: '2em' }} padding='none'>
										<Typography>{item.value as string}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Box>
		</>
	);
};

export default Car;
