import {
	Box,
	Button,
	IconButton,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tabs,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { Brand } from 'api/brands/types';
import {
	PageProduct,
	PageProductCabin,
	PageProductSparePart,
	PageProductTire,
	PageProductWheel
} from 'api/pages/types';
import { Product as IProduct } from 'api/types';
import FavoriteButton from 'components/FavoriteButton';
import GalleryImages from 'components/features/GalleryImages/GalleryImages';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { FC, useState } from 'react';
import { isSparePart, isTire, isWheel } from 'services/ProductService';
import WhiteBox from 'components/WhiteBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ChevronDownIcon, ChevronUpIcon, PhoneCallFilledIcon, PhoneCallIcon, ShareIcon } from 'components/Icons';
import { ShareButton } from 'components/features/ShareButton';
import { Carousel } from 'components/Carousel';
import ProductItem from 'components/ProductItem';

interface Props {
	page: PageProduct & (PageProductCabin | PageProductSparePart | PageProductTire | PageProductWheel);
	data: IProduct;
	relatedProducts: IProduct[];
	printOptions: { text: string; value?: string | number }[];
}

const Product: FC<Props> = ({ data, printOptions, page, relatedProducts }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState('description');
	const [isMoreFilters, setIsMoreFilters] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	const handleClose = () => {
		setSelectedImageIndex(null);
	};

	const handleClickImage = (i: number) => () => {
		setSelectedImageIndex(i);
	};

	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
	};

	const handleScrollDown = () => {
		if (data.images && data.images.length > 0) {
			const nextIndex = Math.min(currentImageIndex + 1, data.images.length - 1);
			setCurrentImageIndex(nextIndex);
		}
	};

	const descriptions = isSparePart(data)
		? [
				{
					title: 'Год',
					value: data.year
				},
				{
					title: 'Ориг.номер',
					value: data.id
				},
				{
					title: 'Обьем двигателя',
					value: data.volume.name
				},
				{
					title: 'Тип топлива',
					value: data.fuel
				},
				{
					title: 'Примечание',
					value: data.description
				},
				{
					title: 'Маркировка двигателя',
					value: data.engine
				},
				{
					title: 'КПП',
					value: data.transmission
				},
				{
					title: 'Привод',
					value: data.id
				},
				{
					title: 'Тип кузова',
					value: data.id
				}
		  ]
		: [];

	const renderTabContent = {
		description: (
			<>
				<Table sx={{ mt: 1 }}>
					<TableBody>
						{descriptions.slice(0, isMoreFilters ? descriptions.length : 5).map((item, index) => (
							<TableRow sx={{ backgroundColor: index % 2 === 0 ? '#F5F5F5' : 'initial' }} key={data.id}>
								<TableCell sx={{ minWidth: '200px', p: 1, border: 'none' }} padding='none'>
									<Typography>{item.title}</Typography>
								</TableCell>
								<TableCell
									sx={{ textAlign: 'right', p: 1, border: 'none' }}
									width='100%'
									padding='none'
								>
									<Typography>{item.value}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Button
					size='small'
					sx={{ alignSelf: 'flex-start', px: 1, mt: 1 }}
					onClick={() => setIsMoreFilters(!isMoreFilters)}
					endIcon={isMoreFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
				>
					{isMoreFilters ? 'Меньше параметров' : 'Больше параметров'}
				</Button>
			</>
		),
		delivery: <Typography>Доставка</Typography>,
		guarantee: <Typography>Гарантия</Typography>,
		payment: <Typography>Оплата</Typography>
	};

	return (
		<Box
			bgcolor={{ xs: '#fff', md: 'transparent' }}
			ml={{ xs: -2, md: 0 }}
			pl={{ xs: 1, md: 0 }}
			pr={{ xs: 1, md: 0 }}
			width={{ xs: 'calc(100% + 2em)', md: '100%' }}
		>
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={1}>
				<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} flex={1} gap={1}>
					<Box display={{ xs: 'flex', md: 'none' }} alignItems='center' gap={1}>
						<Box display='flex' flex={1} alignItems='center' gap={1}>
							<Typography variant='body1' color='custom.text-muted'>
								Артикул:
							</Typography>
							<Typography variant='body1' color='text.primary'>
								{data.id}
							</Typography>
						</Box>
						<Box display='flex' alignItems='center'>
							<ShareButton
								title={data.h1}
								text={`Посмотрите на этот товар: ${data.h1}`}
								url={typeof window !== 'undefined' ? window.location.href : ''}
								withText={!isMobile}
							/>
							<FavoriteButton product={data} title={isMobile ? '' : 'В избранное'}></FavoriteButton>
						</Box>
					</Box>
					<Box width={56} display={{ xs: 'none', md: 'block' }} height={255}>
						<Carousel
							showNextArrow={data.images?.length && data.images.length > 5 ? true : false}
							showPrevArrow={false}
							options={{ axis: 'y' }}
							carouselContainerSx={{ mt: -1 }}
							showDots={false}
							arrowNextSx={{ bottom: -48 }}
							arrowNextButtonSx={{ width: 56 }}
						>
							{data.images?.map((item, i) => (
								<Box
									borderRadius={'6px'}
									onClick={() => handleImageClick(i)}
									key={item.id}
									width={56}
									height={52}
									pt={1}
								>
									<Image
										src={item.url}
										alt={item.alternativeText}
										width={56}
										height={44}
										style={{
											borderRadius: '4px',
											objectFit: 'cover',
											border:
												currentImageIndex === i
													? `2px solid ${theme.palette.text.primary}`
													: 'none'
										}}
									></Image>
								</Box>
							))}
						</Carousel>
					</Box>

					{isMobile ? (
						<Carousel carouselContainerSx={{ ml: -1 }} showArrows={false} showDots={true}>
							{data.images?.map((item, i) => (
								<Box pl={1} width={'90%'} height={280} key={item.id}>
									<Image
										src={item.url}
										alt={item.alternativeText}
										width={300}
										height={256}
										style={{ borderRadius: '16px', objectFit: 'cover', width: '100%' }}
									></Image>
								</Box>
							))}
						</Carousel>
					) : (
						<Box onClick={handleClickImage(currentImageIndex)}>
							<Image
								src={data.images?.[currentImageIndex]?.url}
								alt={data.images?.[currentImageIndex]?.alternativeText}
								width={632}
								height={505}
								style={{
									borderRadius: '16px',
									objectFit: 'cover'
								}}
							></Image>
						</Box>
					)}
				</Box>
				<Box flex={1}>
					<WhiteBox px={{ xs: 0, md: 2 }} py={{ xs: 0, md: 1.5 }} mb={1} border={0}>
						<Box mb={1.5} display={{ xs: 'none', md: 'flex' }} alignItems='center' gap={1}>
							<Box display='flex' flex={1} alignItems='center' gap={1}>
								<Typography variant='body1' color='custom.text-muted'>
									Артикул:
								</Typography>
								<Typography variant='body1' color='text.primary'>
									{data.id}
								</Typography>
							</Box>
							<Box display='flex' alignItems='center'>
								<ShareButton
									title={data.h1}
									text={`Посмотрите на этот товар: ${data.h1}`}
									url={typeof window !== 'undefined' ? window.location.href : ''}
								/>
								<FavoriteButton product={data} title='В избранное'></FavoriteButton>
							</Box>
						</Box>
						<Typography px={{ xs: 1, md: 0 }} fontWeight='bold' variant='h6' mb={1.5}>
							{data.h1}
						</Typography>
						<Box
							bgcolor='#F5F5F5'
							borderRadius={3}
							p={1.5}
							mb={{ xs: 0, md: 1.5 }}
							display='flex'
							gap={1}
							alignItems='baseline'
							width={{ xs: '100%', md: 'fit-content' }}
						>
							{data.discountPrice ? (
								<>
									<Typography variant='h6' color='text.secondary'>
										{data.discountPrice} руб
									</Typography>
									<Typography
										color='custom.text-muted'
										variant='body1'
										sx={{ textDecoration: 'line-through' }}
									>
										{data.price} руб
									</Typography>
								</>
							) : (
								<Typography variant='h6' color='text.secondary'>
									{data.price} руб
								</Typography>
							)}
						</Box>
						<Button sx={{ display: { xs: 'none', md: 'block' } }} variant='contained'>
							Добавить в корзину
						</Button>
					</WhiteBox>
					<WhiteBox border={0} mb={{ xs: 3, md: 0 }} px={{ xs: 1, md: 2 }} py={{ xs: 0, md: 1.5 }}>
						<Tabs value={activeTab} onChange={handleTabChange}>
							<Tab label='Описание' value='description'></Tab>
							<Tab label='Доставка' value='delivery'></Tab>
							<Tab label='Гарантия' value='guarantee'></Tab>
							<Tab label='Оплата' value='payment'></Tab>
						</Tabs>
						{renderTabContent[activeTab as keyof typeof renderTabContent]}
					</WhiteBox>
				</Box>
			</Box>
			<Typography mb={1} variant='h6' fontWeight='bold'>
				{isSparePart(data) && 'Другие запчасти для'}
				{isTire(data) && 'Другие шины для'}
				{isWheel(data) && 'Другие диски для'}
				{data.type === 'cabin' && 'Другие кабины для'} {data.brand?.name}{' '}
				{isSparePart(data) && data.model?.name} {isSparePart(data) && data.generation?.name}
			</Typography>
			<Carousel
				sx={{ mb: 3 }}
				options={{ axis: 'x', watchDrag: false, loop: true }}
				showArrows={true}
				showDots={false}
				carouselContainerSx={{ ml: -1 }}
			>
				{relatedProducts.map((item) => (
					<Box pl={1} key={item.id}>
						<ProductItem
							data={item}
							width={isMobile ? 155 : 228}
							imageHeight={isMobile ? 120 : 180}
						></ProductItem>
					</Box>
				))}
			</Carousel>
			<WhiteBox
				width={{ xs: '100%', md: 'fit-content' }}
				alignItems='center'
				borderRadius={4}
				gap={1}
				p={1.5}
				py={2}
				mb={2}
				bgcolor={{ xs: 'custom.bg-surface-1', md: 'white' }}
				display='flex'
				border={0}
			>
				<Box
					bgcolor={'success.main'}
					width={40}
					borderRadius={'50%'}
					height={40}
					display='flex'
					alignItems='center'
					justifyContent='center'
					color='white'
				>
					<PhoneCallFilledIcon></PhoneCallFilledIcon>
				</Box>
				<Box>
					<Typography variant='body1' fontSize={'16px'} fontWeight={500} color='text.secondary'>
						Остались вопросы?
					</Typography>
					<Typography variant='body1' color='text.primary'>
						Мы можем с вами связаться
					</Typography>
				</Box>
			</WhiteBox>
			<Typography color='text.secondary' fontSize='18px' variant='h6' fontWeight='700'>
				Б/у патрубок интеркулера для Audi A4 B6 – надёжное решение от Авторазборка Полотково ООО "Дриблинг"
			</Typography>
			<Typography variant='body1' color='text.primary' mb={1}>
				Ищете исправный и проверенный патрубок интеркулера для Audi A4 B6 года? В наличии оригинальные б/у
				патрубки интеркулера, прошедшие диагностику и контроль качества. Все запчасти тщательно проверяются на
				герметичность, целостность и соответствие заводским стандартам. Указываются оригинальные номера и
				маркировка производителя, что упрощает подбор и установку
			</Typography>
			<Typography color='text.secondary' fontSize='18px' variant='h6' fontWeight='700'>
				Доставка патрубок интеркулера для Audi A4 B6по Гродно и всей Беларуси
			</Typography>
			<Typography variant='body1' color='text.primary' mb={1}>
				Авторазборка Полотково ООО "Дриблинг" предлагает удобные варианты доставки в Гродно и любые регионы
				Беларуси. Мы отправляем заказы транспортом компании в областные центры, такие как Гродно, Гомель, Брест,
				Витебск, Могилев, а также по области. Также доступна доставка через почтоматы АвтолайтЭкспресс и выдача
				в магазинах-партнёрах
			</Typography>
			<Typography color='text.secondary' fontSize='18px' variant='h6' fontWeight='700'>
				Качественные б/у автозапчасти с гарантией
			</Typography>
			<Typography variant='body1' color='text.primary' mb={1}>
				Все детали с нашей авторазборки поступают из Европы, имеют прозрачную историю эксплуатации и проходят
				проверку на работоспособность. Мы гарантируем высокое качество, совместимость и отличное состояние
				каждой запчасти. Обращаясь в Авторазборку Полотково ООО "Дриблинг", вы получаете профессиональный подход
				и честный сервис при покупке патрубок интеркулера для Audi A4 B6
			</Typography>
			<GalleryImages
				images={data.images}
				selectedIndex={selectedImageIndex}
				onClose={handleClose}
			></GalleryImages>
			<Box
				position='fixed'
				bottom={50}
				display={{ xs: 'flex', md: 'none' }}
				zIndex={2}
				bgcolor='#F5F5F5'
				left={0}
				right={0}
				px={2}
				borderTop='1px solid #D0D5DD'
				py={1}
			>
				<Button fullWidth variant='contained'>
					Добавить в корзину
				</Button>
			</Box>
		</Box>
	);

	// return (
	// 	<>
	// 		<Box display='flex' marginTop='3em' gap={'2em'} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
	// 			{renderH1('mobile')}
	// 			<Box>
	// 				<Box display='flex' sx={{ width: { xs: '100%', md: '570px' } }} maxHeight={isMobile ? 360 : 480}>
	// 					{data.images ? (
	// 						<>
	// 							<Box>
	// 								<Slider
	// 									ref={(ref) => {
	// 										setSliderSmall(ref);
	// 									}}
	// 									swipeToSlide
	// 									verticalSwiping
	// 									autoplay
	// 									autoplaySpeed={5000}
	// 									vertical
	// 									arrows={false}
	// 									slidesToShow={getSlidesToShow()}
	// 									focusOnSelect
	// 									className={classNames(
	// 										styles.slider,
	// 										styles.slider_small,
	// 										isMobile && styles.slider_small_mobile
	// 									)}
	// 									asNavFor={sliderBig || undefined}
	// 								>
	// 									{data.images.map((item) => (
	// 										<Box key={item.id}>
	// 											<Image
	// 												style={{ objectPosition: 'top' }}
	// 												title={item.caption}
	// 												alt={item.alternativeText}
	// 												width={104}
	// 												height={78}
	// 												src={item.formats?.thumbnail.url || item.url}
	// 											></Image>
	// 										</Box>
	// 									))}
	// 									{isSparePart(data) && data.videoLink && (
	// 										<Box>
	// 											<Typography
	// 												width={98}
	// 												bgcolor='primary.main'
	// 												height={98}
	// 												display='flex'
	// 												alignItems='center'
	// 												justifyContent='center'
	// 											>
	// 												Видео
	// 											</Typography>
	// 										</Box>
	// 									)}
	// 								</Slider>
	// 							</Box>
	// 							<Slider
	// 								ref={(ref) => {
	// 									setSliderBig(ref);
	// 								}}
	// 								asNavFor={sliderSmall || undefined}
	// 								arrows={false}
	// 								className={classNames(styles.slider, isMobile && styles.slider_mobile)}
	// 							>
	// 								{data.images.map((item, i) => (
	// 									<Box onClick={handleClickImage(i)} sx={{ paddingX: '0.25em' }} key={item.id}>
	// 										<Image
	// 											title={item.caption}
	// 											// style={{ height: '100%' }}
	// 											style={{
	// 												objectPosition: 'top',
	// 												...(isMobile ? { height: 'auto' } : {})
	// 											}}
	// 											alt={item.alternativeText}
	// 											width={470}
	// 											height={isMobile ? 360 : 480}
	// 											src={item.url}
	// 										></Image>
	// 									</Box>
	// 								))}
	// 								{isSparePart(data) && data.videoLink && (
	// 									<Box>
	// 										<ReactPlayer
	// 											controls
	// 											onPlay={() => sliderSmall?.slickPause()}
	// 											onPause={() => sliderSmall?.slickPlay()}
	// 											onEnded={() => sliderSmall?.slickPlay()}
	// 											style={{ height: '100%' }}
	// 											width={'100%'}
	// 											height={isMobile ? '100%' : 480}
	// 											src={data.videoLink}
	// 										></ReactPlayer>
	// 									</Box>
	// 								)}
	// 							</Slider>
	// 						</>
	// 					) : (
	// 						<Image
	// 							title={data.name}
	// 							alt={data.name}
	// 							quality={100}
	// 							width={540}
	// 							height={isMobile ? 360 : 480}
	// 							style={{ objectFit: 'cover', height: 'auto' }}
	// 							src=''
	// 						></Image>
	// 					)}
	// 				</Box>
	// 			</Box>
	// 			<Box flex='1'>
	// 				{renderH1('desktop')}
	// 				<Box display='flex' alignItems='center'>
	// 					{!!data.discountPrice && (
	// 						<>
	// 							<Typography variant='h5'>Скидка:</Typography>
	// 							<Typography fontWeight='bold' variant='h4' marginRight='0.5em' color='secondary'>
	// 								{data.discountPrice} руб{' '}
	// 							</Typography>
	// 						</>
	// 					)}
	// 					{!!data.discountPriceUSD && (
	// 						<Typography color='text.primary'>~{data.discountPriceUSD.toFixed()}$</Typography>
	// 					)}
	// 				</Box>

	// 				<Box display='flex' alignItems='center' marginBottom={{ xs: '1em', md: '1em' }}>
	// 					<Typography
	// 						marginRight='0.5em'
	// 						textAlign='center'
	// 						fontWeight='bold'
	// 						variant='h4'
	// 						component={data.discountPrice ? 's' : 'p'}
	// 						sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
	// 						color='secondary'
	// 					>
	// 						{data.price} руб{' '}
	// 					</Typography>
	// 					{!!data.priceUSD && (
	// 						<Typography mr='0.25em' color='text.secondary'>
	// 							~{data.priceUSD.toFixed()}$
	// 						</Typography>
	// 					)}
	// 					{!!data.priceRUB && <Typography color='text.secondary'>~{data.priceRUB.toFixed()}₽</Typography>}
	// 					<NextLink href={'/delivery'}>
	// 						<IconButton>
	// 							<LocalShippingIcon titleAccess='Доставка' color='primary'></LocalShippingIcon>
	// 						</IconButton>
	// 					</NextLink>
	// 					<NextLink href='/guarantee'>
	// 						<IconButton>
	// 							<ShieldIcon titleAccess='Гарантия' color='primary'></ShieldIcon>
	// 						</IconButton>
	// 					</NextLink>
	// 					<FavoriteButton product={data}></FavoriteButton>
	// 				</Box>
	// 				{renderActionBtns}
	// 				<Button
	// 					variant='contained'
	// 					onClick={handleClickBuyInstallments}
	// 					sx={{ maxWidth: 438, fontSize: '1em' }}
	// 					fullWidth
	// 				>
	// 					купить в рассрочку
	// 				</Button>

	// 				<Table sx={{ marginY: '1em' }}>
	// 					<TableBody>
	// 						{printOptions.map((item) => (
	// 							<TableRow key={item.value}>
	// 								<TableCell
	// 									sx={{ border: 'none', padding: '0 0 1em 0', minWidth: '150px' }}
	// 									padding='none'
	// 								>
	// 									<Typography whiteSpace={{ xs: 'initial', md: 'nowrap' }} fontWeight='500'>
	// 										{item.text}
	// 									</Typography>
	// 								</TableCell>
	// 								<TableCell
	// 									width='100%'
	// 									sx={{
	// 										border: 'none',
	// 										verticalAlign: 'baseline',
	// 										paddingLeft: { xs: '0.5em', sm: '2em' },
	// 										wordBreak: { xs: 'break-word', sm: 'initial' }
	// 									}}
	// 									padding='none'
	// 								>
	// 									<Typography>{item.value}</Typography>
	// 								</TableCell>
	// 							</TableRow>
	// 						))}
	// 					</TableBody>
	// 				</Table>
	// 			</Box>
	// 		</Box>
	// 		<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
	// 			Описание
	// 		</Typography>
	// 		<Typography paddingLeft='35px'>{data.description}</Typography>
	// 		<Box paddingLeft='35px'>
	// 			<ReactMarkdown content={page.additionalDescription}></ReactMarkdown>
	// 		</Box>

	// 		<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
	// 			Характеристики для {data.h1}
	// 		</Typography>
	// 		{page.textAfterDescription && (
	// 			<Box paddingLeft='35px'>
	// 				<ReactMarkdown content={page.textAfterDescription}></ReactMarkdown>
	// 			</Box>
	// 		)}
	// 		<Typography withSeparator gutterBottom marginY='1em' component='h2' variant='h5' fontWeight='500'>
	// 			{data.h1} вы можете купить в рассрочку
	// 		</Typography>
	// 		<Box
	// 			ref={installmentPlanBlockRef}
	// 			margin={{ xs: 0, sm: '0 2em' }}
	// 			padding='1em'
	// 			border='1px solid'
	// 			borderColor='primary.main'
	// 			borderRadius='10px'
	// 		>
	// 			<Box paddingX='1.5em' marginBottom='1em'>
	// 				<Slider className={styles['installment-plan-slider']} dots={!isMobile} swipe={false}>
	// 					{CONFIG_INSTALLMENT_PLAN.map((item, index) => (
	// 						<Box gap='10px' key={item.id} display={{ xs: 'initial', sm: 'flex!important' }}>
	// 							<Image
	// 								src={item.imgSrc}
	// 								alt={item.alt}
	// 								style={isMobile ? { margin: 'auto', height: 'auto' } : {}}
	// 								isOnSSR={false}
	// 								width={300}
	// 								height={250}
	// 							></Image>
	// 							<Box
	// 								marginBottom='1em'
	// 								display='flex'
	// 								flexDirection='column'
	// 								justifyContent='center'
	// 								paddingX='0.25em'
	// 								flex={1}
	// 							>
	// 								<Typography component={'h3'} variant='h5'>
	// 									Купить {data.h1} по карте {item.name}
	// 								</Typography>
	// 								<Typography>Срок рассрочки в месяцах</Typography>
	// 								<Box paddingRight='1.5em' paddingLeft='0.5em'>
	// 									<SliderRange
	// 										marks={new Array(12)
	// 											.fill(null)
	// 											.map((_, index) => ({ label: index + 1, value: index + 1 }))}
	// 										step={1}
	// 										value={item.months}
	// 										min={1}
	// 										max={12}
	// 									></SliderRange>
	// 								</Box>
	// 								<Typography>Сумма платежа в месяц</Typography>
	// 								<Box paddingRight='1.5em' marginTop='2em' paddingLeft='0.5em'>
	// 									<SliderRange
	// 										classes={{ valueLabel: styles['slider-range-value'] }}
	// 										marks={[
	// 											{
	// 												value: 1,
	// 												label: '1'
	// 											},
	// 											{
	// 												value: 1000,
	// 												label: '1000'
	// 											},
	// 											{
	// 												value: 2000,
	// 												label: '2000'
	// 											},
	// 											{
	// 												value: 3000,
	// 												label: '3000'
	// 											}
	// 										]}
	// 										valueLabelDisplay='on'
	// 										value={Math.ceil(data.price / item.months)}
	// 										min={1}
	// 										max={3000}
	// 									></SliderRange>
	// 								</Box>
	// 								{!sold && item.id === 'halva' && (
	// 									<Box>
	// 										<Buy
	// 											title='Купить в рассрочку'
	// 											onSold={handleSold}
	// 											paymentMethodType={item.paymentMethodType}
	// 											products={[data]}
	// 										></Buy>
	// 									</Box>
	// 								)}
	// 							</Box>
	// 						</Box>
	// 					))}
	// 				</Slider>
	// 			</Box>
	// 			<Box>
	// 				<Typography>
	// 					Уважаемые друзья, У нас есть отличная новость для вас! Теперь вы можете приобрести {data.h1} в
	// 					рассрочку, что сделает покупку удобной и выгодной для вас. Рассрочка - это прекрасная
	// 					возможность распределить стоимость товара на несколько месяцев, не нагружая ваш бюджет. Вы
	// 					сможете наслаждаться всеми преимуществами товара уже сейчас, не откладывая его покупку на потом.
	// 					Удобные условия рассрочки сделают вашу покупку еще более привлекательной. Так что не упустите
	// 					шанс. не переживайте о финансах - выбирайте рассрочку и пользуйтесь нашим {data.h1} прямо
	// 					сейчас!
	// 				</Typography>
	// 			</Box>
	// 		</Box>
	// 		<CarouselProducts
	// 			sx={{ paddingX: { xs: '1em', md: '0' } }}
	// 			data={relatedProducts}
	// 			title={
	// 				<Typography
	// 					textTransform='uppercase'
	// 					withSeparator
	// 					fontWeight='500'
	// 					marginBottom='1em'
	// 					marginTop='1em'
	// 					variant='h5'
	// 				>
	// 					ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ НА НАШИ {TYPE_TEXT[data.type]} ОТ {data.brand?.name}{' '}
	// 					{!isTire(data) && data.model?.name}
	// 				</Typography>
	// 			}
	// 		></CarouselProducts>
	// 		<Typography
	// 			withSeparator
	// 			textTransform='uppercase'
	// 			fontWeight='500'
	// 			gutterBottom
	// 			component='h3'
	// 			marginBottom='1.5em'
	// 			marginTop='1.5em'
	// 			variant='h5'
	// 		>
	// 			Почему мы лучшие в своем деле?
	// 		</Typography>
	// 		{renderWhyWeBest(whyWeBest1)}
	// 		<Typography
	// 			withSeparator
	// 			marginBottom='1.5em'
	// 			textTransform='uppercase'
	// 			fontWeight='500'
	// 			component='h3'
	// 			variant='h5'
	// 		>
	// 			Мы осуществляем доставку во все <br></br> населенные пункты беларуси
	// 		</Typography>
	// 		<Typography paddingLeft='35px' marginBottom='2em'>
	// 			Наши {TYPE_TEXT[data.type]} б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в
	// 			следующих городах Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем что
	// 			работаем во всех городах и деревнях, просто доставка займет немного больше времени. Будьте уверены, мы
	// 			приложим все силы, что бы ваш товар - {data.h1} был доставлен максимально быстро.
	// 		</Typography>
	// 		{renderWhyWeBest(whyWeBest2)}
	// 		{brandText && <ReactMarkdown content={brandText}></ReactMarkdown>}
	// 		{!isTire(data) && (
	// 			<Typography marginBottom='1em'>
	// 				Продаем только оригинальные, качественные б/у детали для иномарок {data.brand?.name}{' '}
	// 				{data.model?.name} без пробега по Беларуси. {TYPE_TEXT[data.type]} с гарантией до 30 дней Доставка
	// 				по РБ в течение суток-двух, в зависимости от места расположения. Огромный каталог товаров запчастей
	// 				на сайте! Выбирайте и заказывайте! У нас в ассортименте представлены автозапчасти б/у на все
	// 				известные иномарки. Являясь первыми импортерами, мы предоставляем отличные цены поставляемых
	// 				контрактных деталей. При заказе {data.h1} наша курьерская служба поможет организовать доставку во
	// 				все населенные пункты нашей родины. Для постоянных клиентов предоставляем бонусы и скидки.
	// 			</Typography>
	// 		)}
	// 		<Typography
	// 			gutterBottom
	// 			textTransform='uppercase'
	// 			withSeparator
	// 			component='h2'
	// 			variant='h5'
	// 			fontWeight='500'
	// 		>
	// 			наши эксперты всегда помогут подобрать вам нужные {TYPE_TEXT[data.type]}
	// 		</Typography>
	// 		<Typography paddingLeft='35px'>
	// 			Не стоит экономить на безопасности и выбирать недорогие, но неизвестного производителя запчасти. Лучше
	// 			всего выбирать оригинальные {TYPE_TEXT[data.type]} или качественные аналоги от известных производителей.
	// 		</Typography>
	// 		<GalleryImages
	// 			images={data.images}
	// 			selectedIndex={selectedImageIndex}
	// 			onClose={handleClose}
	// 		></GalleryImages>
	// 	</>
	// );
};

export default Product;
