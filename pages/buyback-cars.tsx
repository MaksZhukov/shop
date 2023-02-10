import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageBuybackCars } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import Slider from 'react-slick';
import { Box } from '@mui/system';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { Button, CircularProgress, Container, Input, TextField, useTheme } from '@mui/material';
import Autocomplete from 'components/Autocomplete';
import { Brand } from 'api/brands/types';
import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useRef, useState } from 'react';
import { Model } from 'api/models/types';
import { fetchModels } from 'api/models/models';
import { API_MAX_LIMIT } from 'api/constants';
import { useSnackbar } from 'notistack';
import { YEARS } from '../constants';
import InputMask from 'react-input-mask';
import { send } from 'api/email';
import LoadingButton from '@mui/lab/LoadingButton';
import { useThrottle } from 'rooks';

import styles from './buyback-cars.module.scss';
import classNames from 'classnames';

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

const BUYBACK_ANY_CARS = [
	{ title: 'Новые', description: 'Дадим от 95% рыночной стоимости', imgUrl: '/buyback_any_cars_1.png' },
	{ title: 'После ДТП', description: 'Выкупим битые автомобили', imgUrl: '/buyback_any_cars_2.png' },
	{ title: 'Взятые в кредит', description: 'Погасим Ваш кредит и переоформим', imgUrl: '/buyback_any_cars_3.png' },
	{
		title: 'Старые авто',
		description: 'Возраст не имеет значение',
		imgUrl: '/buyback_any_cars_4.png',
		imgWidth: 113,
		imgHeight: 113,
	},
	{ title: 'С пробегом', description: 'Такие нам даже больше нравятся', imgUrl: '/buyback_any_cars_5.png' },
	{
		title: 'После возгорания',
		description: 'Нас не пугают  машины после пожара',
		imgUrl: '/buyback_any_cars_6.png',
		imgWidth: 113,
	},
];

const STEPS = [
	{ title: '1', description: 'Позвоните или оставьте онлайн заявку' },
	{ title: '2', description: 'Мы оценим Ваш автотранспорт и юридически оформим сделку' },
	{ title: '3', description: 'Вы получите деньги и мы заберем автомобиль' },
];

interface Props {
	page: PageBuybackCars;
	brands: Brand[];
	cars: CarOnParts[];
}

const BuybackCars = ({ page, cars = [], brands }: Props) => {
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
	const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
	const [year, setYear] = useState<string | null>(null);
	const [phone, setPhone] = useState<string>('');
	const ref = useRef<HTMLFormElement>(null);

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
				pagination: { limit: API_MAX_LIMIT },
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
		setIsEmailSending(true);
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
		setIsEmailSending(false);
	}, 300);

	const handleClickAssessment = () => {
		ref.current?.scrollIntoView({});
	};

	return (
		<>
			<Box className={styles.head} marginBottom='2em' minHeight={744} display='flex'>
				<Container>
					<Box display='flex' height={'100%'} position='relative' zIndex={1} ref={ref}>
						<Typography
							marginTop={'-25%'}
							marginRight={'3%'}
							textAlign='right'
							component='h1'
							fontWeight={'500'}
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
							<Typography variant='h5' color='#fff' fontWeight='500' marginBottom='1em'>
								Оценить автомобиль
							</Typography>
							<Autocomplete
								disabled={isEmailSending}
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
								disabled={!brand || isEmailSending}
								noOptionsText={noOptionsText}
								onOpen={handleOpenAutocompleteModels}
								onChange={handleChangeAutocomplete(setModel)}
								options={models.map((item) => ({ label: item.name, value: item.name }))}
							></Autocomplete>
							<Autocomplete
								disabled={isEmailSending}
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
								disabled={isEmailSending}
								maskChar=' '
								onChange={handleChangePhone}
							>
								{
									//@ts-ignore
									(inputProps) => {
										return (
											<Input
												{...inputProps}
												inputRef={(ref) => {
													if (ref) {
														ref.disabled = isEmailSending;
													}
												}}
												className={styles.input}
												sx={{ color: isEmailSending ? 'rgba(0,0,0,0.4)' : 'initial' }}
												placeholder='Ваш телефон'
												fullWidth
											></Input>
										);
									}
								}
							</InputMask>
							<LoadingButton
								loading={isEmailSending}
								sx={{ padding: '1.25em', borderRadius: 0, fontSize: '16px' }}
								className={classNames(styles.btn, isEmailSending && styles.btn_loading)}
								fullWidth
								type='submit'
								variant='contained'
							>
								Оставить заявку
							</LoadingButton>
						</Box>
					</Box>
				</Container>
			</Box>
			<Container>
				<Box marginBottom='5em'>
					<Typography component='h2' variant='h3' fontWeight='500' textAlign='center' marginBottom='2em'>
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
						fontWeight='500'
						textTransform='uppercase'
						component='h2'
						variant='h3'
						marginBottom='1.5em'
					>
						Наши{' '}
						<Typography component='span' color='primary' variant='h3'>
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
			</Container>
			<Box className={styles['section-advantages']}>
				<Container>
					<Typography
						textTransform='uppercase'
						component='h2'
						fontWeight='500'
						variant='h3'
						marginBottom='1.5em'
					>
						УДОБНО{' '}
						<Typography variant='h3' color='primary' component='span'>
							ВЫГОДНО
						</Typography>{' '}
						БЫСТРО
					</Typography>
					<Box className={styles.list}>
						<Typography className={styles.list__item}>
							Приедем на оценку вашего авто в течении 1 часа
						</Typography>
						<Typography className={styles.list__item}>
							Предложим от 95% от рыночной стоимости авто
						</Typography>
						<Typography className={styles.list__item}>Оплата любым удобным для Вас способом</Typography>
						<Typography className={styles.list__item}>Готовы приехать в область</Typography>
					</Box>
				</Container>
			</Box>
			<Box padding='1em' bgcolor='#fff'>
				<Container>
					<Typography marginBottom='2em' variant='h3' textAlign='center'>
						ВЫКУП{' '}
						<Typography variant='h3' color='primary' component='span'>
							ЛЮБЫХ АВТОМОБИЛЕЙ
						</Typography>
					</Typography>
					<Box display='flex' flexWrap='wrap'>
						{BUYBACK_ANY_CARS.map((item) => (
							<Box key={item.title} width={'33.3%'} marginBottom='3em' textAlign='center'>
								<Box display='flex' alignItems='center' width={115} height={115} margin='auto'>
									<Image
										isOnSSR={false}
										width={item.imgWidth || 100}
										height={item.imgHeight || 100}
										alt={item.title}
										src={item.imgUrl}
									></Image>
								</Box>
								<Typography marginTop='1em' marginBottom='0.5em' variant='h6'>
									{item.title}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{item.description}
								</Typography>
							</Box>
						))}
					</Box>
				</Container>
			</Box>
			<Box marginTop='176px' position='relative' textAlign='center'>
				<Box position='absolute' width='100%' top={'-176px'}>
					<Image
						width={567}
						height={376}
						isOnSSR={false}
						src={'/buyback_easy_sell.png'}
						alt=' ПРОДАТЬ АВТОМОБИЛЬ ЛЕГКО'
					></Image>
				</Box>
				<Box bgcolor='primary.main' paddingTop='250px' minHeight={500}>
					<Container>
						<Typography fontWeight='500' textAlign='center' marginBottom='1em' variant='h3'>
							ПРОДАТЬ АВТОМОБИЛЬ ЛЕГКО!
						</Typography>
						<Box display='flex' className={styles.steps}>
							{STEPS.map((item) => (
								<Box
									display='flex'
									flexDirection='column'
									key={item.title}
									height={200}
									justifyContent='center'
									alignItems='center'
									className={styles.steps__item}
								>
									<Typography variant='h2' marginBottom='0.25em' fontWeight='bold'>
										{item.title}
									</Typography>
									<Typography maxWidth={250}>{item.description}</Typography>
								</Box>
							))}
						</Box>
					</Container>
				</Box>
			</Box>
			<Box bgcolor='secondary.main' padding='2em 4em 3em' marginBottom='5em'>
				<Container>
					<Box display='flex' alignItems='center'>
						<Typography flex='1' color='#fff'>
							Оставьте заявку на бесплатную <br></br> оценку вашего автомобиля
						</Typography>
						<Button
							className={styles['btn-assessment']}
							variant='contained'
							onClick={handleClickAssessment}
						>
							Оценить автомобиль
						</Button>
					</Box>
				</Container>
			</Box>
			<Box className={styles['section-why-we']}>
				<Container>
					<Box maxWidth={650} paddingLeft='4em' margin='auto'>
						<Typography marginBottom='1em' variant='h3'>
							ПОЧЕМУ ВЫБИРАЮТ НАС
						</Typography>
						<Box className={styles.list}>
							<Typography className={styles.list__item}>
								Мы гарантируем юридическую чистоту сделки
							</Typography>
							<Typography className={styles.list__item}>
								Заключаем договор и выплачиваем всю сумму без каких-либо комиссий и удержаний
							</Typography>
							<Typography className={styles.list__item}>
								Работая с нами вы защищаете себя от мошенничества со стороны недобросовестных
								покупателей
							</Typography>
							<Typography className={styles.list__item}>
								Проводим сделки купли-продажи автомобилей уже 10 лет
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>
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
