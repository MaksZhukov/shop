import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import Slider from 'react-slick';
import { Box } from '@mui/system';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { Button, CircularProgress, Container, Input, TextField, useTheme } from '@mui/material';
import styles from './buyback-cars.module.scss';
import Autocomplete from 'components/Autocomplete';
import { Brand } from 'api/brands/types';
import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useState } from 'react';
import { Model } from 'api/models/types';
import { fetchModels } from 'api/models/models';
import { MAX_LIMIT } from 'api/constants';
import { useSnackbar } from 'notistack';
import { YEARS } from '../constants';
import InputMask from 'react-input-mask';
import { send } from 'api/email';
import { useThrottle } from 'rooks';

const WE_PROVIDES = [
	{
		title: 'Выезд оценщика',
		description: 'В любую точку города и области',
		imgUrl: '/buyback_provide_1.png',
		imgWidth: 104,
		imgHeight: 101,
	},
	{
		title: 'Полное юридическое сопровождение',
		description: 'Поможем снять автомобиль с учета и юридически оформим сделку',
		imgUrl: '/buyback_provide_2.png',
		imgWidth: 82,
		imgHeight: 92,
	},
	{
		title: 'Выезд эвакуатора',
		description: 'Когда машина не исправна мы сами приезжаем за ней',
		imgUrl: '/buyback_provide_3.png',
		imgWidth: 118,
		imgHeight: 87,
	},
];

interface Props {
	page: DefaultPage & { content: string };
	brands: Brand[];
	cars: CarOnParts[];
}

const BuybackCars = ({ page, cars, brands }: Props) => {
	const [brand, setBrand] = useState<{
		label: string;
		value: string;
	} | null>(null);
	const [models, setModels] = useState<Model[]>([]);
	const [model, setModel] = useState<{
		label: string;
		value: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [year, setYear] = useState<string | null>(null);
	const [phone, setPhone] = useState<string>('');

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const { enqueueSnackbar } = useSnackbar();
	const handleChangeAutocomplete =
		(setValue: (value: any) => void, addFunc?: () => void) =>
		(
			_: any,
			selected:
				| {
						label: string;
						value: string;
				  }
				| string
				| null
		) => {
			setValue(selected);
			if (addFunc) {
				addFunc();
			}
		};

	const handleOpenAutocompleteModels = async () => {
		try {
			setIsLoading(true);
			const {
				data: { data },
			} = await fetchModels({
				filters: { brand: { slug: brand?.value } },
				pagination: { limit: MAX_LIMIT },
			});
			setModels(data);
		} catch (err) {
			enqueueSnackbar(
				'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
				{ variant: 'error' }
			);
		}
		setIsLoading(false);
	};

	const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
		setPhone(e.target.value);
	};

	const [throttledSubmit] = useThrottle(async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await send(
				'Запрос на выкуп авто',
				`<b>Телефон</b>: ${phone} <br /><b>Марка</b>: ${brand?.label} <br /><b>Модель</b>: ${model?.label} <br /><b>Год</b>: ${year} <br />`
			);
			enqueueSnackbar('Ваша заявка успешно отправлена', {
				variant: 'success',
			});
			setBrand(null);
			setModel(null);
			setYear(null);
			setPhone('');
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка при отправке, обратитесь в поддержку', {
				variant: 'error',
			});
		}
	}, 300);

	return (
		<>
			<Box className={styles.head} marginBottom='2em' minHeight={744} display='flex'>
				<Container>
					<Box display='flex' height={'100%'} position='relative' zIndex={1}>
						<Typography
							marginTop={'-25%'}
							marginRight={'3%'}
							textAlign='right'
							component='h1'
							fontWeight={'bold'}
							variant='h1'
							alignSelf={'center'}
							flex='1'
							textTransform='uppercase'
						>
							Выкуп{' '}
							<Typography color='primary' variant='h1' component='span'>
								авто
							</Typography>{' '}
							<br></br>
							на З/Ч
						</Typography>
						<Box
							alignSelf='center'
							maxWidth={510}
							borderRadius='2em'
							padding='1em 2em 3em 2em'
							bgcolor='secondary.main'
							textAlign='center'
							onSubmit={throttledSubmit}
							component='form'
							width={510}
						>
							<Typography variant='h5' color='#fff' fontWeight='bold' marginBottom='1em'>
								Оценить автомобиль
							</Typography>
							<Autocomplete
								className={styles.autocomplete}
								required
								classes={{ input: styles.autocomplete__input }}
								value={brand}
								placeholder='Выберите марку'
								onChange={handleChangeAutocomplete(setBrand, () => {
									setModel(null);
									setModels([]);
								})}
								options={brands.map((item) => ({ label: item.name, value: item.slug }))}
							></Autocomplete>
							<Autocomplete
								className={styles.autocomplete}
								classes={{ input: styles.autocomplete__input }}
								required
								value={model}
								placeholder='Выберите модель'
								disabled={!brand}
								noOptionsText={noOptionsText}
								onOpen={handleOpenAutocompleteModels}
								onChange={handleChangeAutocomplete(setModel)}
								options={models.map((item) => ({ label: item.name, value: item.name }))}
							></Autocomplete>
							<Autocomplete
								className={styles.autocomplete}
								classes={{ input: styles.autocomplete__input }}
								value={year}
								placeholder='Укажите год выпуска'
								onChange={handleChangeAutocomplete(setYear)}
								options={YEARS.map((item) => item.toString())}
							></Autocomplete>
							<InputMask
								required
								mask='+375 99 999 99 99'
								value={phone}
								maskChar=' '
								onChange={handleChangePhone}
							>
								{
									//@ts-ignore
									() => (
										<Input
											className={styles.input}
											required
											placeholder='Ваш телефон'
											fullWidth
										></Input>
									)
								}
							</InputMask>
							<Button className={styles.btn} fullWidth type='submit' variant='contained'>
								Оставить заявку
							</Button>
						</Box>
					</Box>
				</Container>
			</Box>
			<Container>
				<Box marginBottom='5em'>
					<Typography component='h2' variant='h4' fontWeight='bold' textAlign='center' marginBottom='2em'>
						МЫ БЕСПЛАТНО ПРЕДОСТАВЛЯЕМ
					</Typography>
					<Box display='flex' gap={'5%'}>
						{WE_PROVIDES.map((item) => (
							<Box width={'30%'} textAlign='center' key={item.title}>
								<Image
									isOnSSR={false}
									src={item.imgUrl}
									alt={item.title}
									width={item.imgWidth}
									height={item.imgHeight}
								></Image>
								<Typography variant='h6' marginBottom='0.5em'>
									{item.title}
								</Typography>
								<Typography color='text.secondary'>{item.description}</Typography>
							</Box>
						))}
					</Box>
				</Box>
				<Box marginBottom='4em'>
					<Typography
						textAlign='center'
						fontWeight='bold'
						textTransform='uppercase'
						component='h2'
						variant='h4'
						marginBottom='1.5em'
					>
						Наши{' '}
						<Typography component='span' color='primary' variant='h4'>
							выкупленные
						</Typography>{' '}
						авто
					</Typography>
					<Slider
						className={styles.slider}
						// autoplaySpeed={5000}
						// autoplay
						slidesToShow={cars.length < 4 ? cars.length : 4}
					>
						{cars.map((item) => {
							let name = item.brand?.name + ' ' + item.model?.name;
							return (
								<Box maxWidth='288px' width='100%' key={item.id}>
									{item.images && item.images.some((image) => image.formats) ? (
										<Slider swipe={false} pauseOnHover arrows={false} autoplay autoplaySpeed={3000}>
											{item.images
												.filter((item) => item.formats)
												.map((image) => (
													<Image
														key={image.id}
														alt={image.alternativeText}
														src={image.formats?.thumbnail.url || image.url}
														width={263}
														height={207}
													/>
												))}
										</Slider>
									) : (
										<Box>
											<Image
												style={{ margin: 'auto', width: '100%' }}
												alt={name}
												src={''}
												width={263}
												height={207}
											/>
										</Box>
									)}
									<Typography
										textAlign='center'
										marginBottom='0.25em'
										variant='h6'
										title={name}
										lineClamp={1}
									>
										{name}
									</Typography>
									<Typography textAlign='center' variant='h5' title={name} lineClamp={1}>
										{item.priceUSD}$
									</Typography>
								</Box>
							);
						})}
					</Slider>
				</Box>
				<Box>
					<Typography
						textAlign='center'
						textTransform='uppercase'
						component='h2'
						fontWeight='bold'
						variant='h4'
						marginBottom='1.5em'
					>
						УДОБНО{' '}
						<Typography variant='h4' color='primary' component='span'>
							ВЫГОДНО
						</Typography>{' '}
						БЫСТРО
					</Typography>
					<Box className={styles.advantages}>
						<Typography className={styles.advantages__item}>
							Приедем на оценку вашего авто в течении 1 часа
						</Typography>
						<Typography className={styles.advantages__item}>
							Предложим от 95% от рыночной стоимости авто
						</Typography>
						<Typography className={styles.advantages__item}>
							Оплата любым удобным для Вас способом
						</Typography>
						<Typography className={styles.advantages__item}>Готовы приехать в область</Typography>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default BuybackCars;

export const getStaticProps = getPageProps(
	fetchPage('buyback-car'),
	async () => ({
		cars: (await fetchCarsOnParts({ pagination: { limit: 10 }, populate: ['brand', 'model', 'images'] })).data.data,
	}),
	() => ({ hasGlobalContainer: false })
);
