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
import {
	PageProduct,
	PageProductCabin,
	PageProductSparePart,
	PageProductTire,
	PageProductWheel
} from 'api/pages/types';
import { Product as IProduct } from 'api/types';
import FavoriteButton from 'components/features/FavoriteButton';
import GalleryImages from 'components/features/GalleryImages/GalleryImages';
import Image from 'components/features/Image';
import Typography from 'components/ui/Typography';
import { FC, useState } from 'react';
import { isSparePart, isTire, isWheel } from 'services/ProductService';
import WhiteBox from 'components/ui/WhiteBox';
import { ChevronDownIcon, ChevronUpIcon, PhoneCallFilledIcon, PhoneCallIcon, ShareIcon } from 'components/icons';
import { ShareButton } from 'components/features/ShareButton';
import { Carousel } from 'components/ui/Carousel';
import ProductItem from 'components/features/ProductItem';

interface Props {
	page: PageProduct & (PageProductCabin | PageProductSparePart | PageProductTire | PageProductWheel);
	data: IProduct;
	printOptions: { text: string; value?: string | number }[];
	relatedProducts: IProduct[];
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
};

export default Product;
