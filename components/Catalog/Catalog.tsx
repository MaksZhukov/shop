import {
	Button,
	CircularProgress,
	MenuItem,
	Menu,
	Pagination,
	PaginationItem,
	List,
	ListItem,
	useMediaQuery,
	useTheme,
	Modal
} from '@mui/material';
import { Box } from '@mui/material';
import { ModelSparePartsCountWithGenerationsSparePartsCount } from 'api/models/types';
import { Product, SEO } from 'api/types';
import Filters from 'components/features/Filters';
import { AutocompleteType, NumberType } from 'components/features/Filters/types';
import ProductItem from 'components/features/ProductItem';
import Typography from 'components/ui/Typography';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from 'components/icons';
import { BrandWithSparePartsCount } from 'api/brands/types';
import { Link, ModalContainer } from 'components/ui';
import { KindSparePartWithSparePartsCount } from 'api/kindSpareParts/types';
import WhiteBox from 'components/ui/WhiteBox';
import { OptionsIcon } from 'components/icons';

type SortItem = {
	value: string;
	name: string;
};

interface Props {
	seo: SEO | null;
	filtersConfig: (AutocompleteType | NumberType)[];
	brands: BrandWithSparePartsCount[];
	models: ModelSparePartsCountWithGenerationsSparePartsCount[];
	filtersValues: { [key: string]: string | null };
	total: number | null;
	data: Product[];
	isLoading: boolean;
	pageCount: number;
	page: number;
	sort: string;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	onChangeSort: (sort: string) => void;
	onChangeHoveredCategory: (category: KindSparePartWithSparePartsCount | null) => void;
	catalogCategories: KindSparePartWithSparePartsCount[];
	relatedCatalogCategories: KindSparePartWithSparePartsCount[];
	hoveredCategory: KindSparePartWithSparePartsCount | null;
}

const selectSortItems = [
	{ value: 'createdAt:desc', name: 'Новые' },
	{ value: 'createdAt:asc', name: 'Старые' },
	{ value: 'price:asc', name: 'Дешёвые' },
	{ value: 'price:desc', name: 'Дорогие' }
];

const Catalog: React.FC<Props> = ({
	filtersConfig,
	seo,
	brands,
	models,
	filtersValues,
	total,
	onClickFind,
	onChangeFilterValues,
	data,
	isLoading,
	pageCount,
	page,
	sort,
	onChangeSort,
	catalogCategories,
	relatedCatalogCategories,
	hoveredCategory,
	onChangeHoveredCategory
}) => {
	const router = useRouter();
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
	const [filtersModalOpen, setFiltersModalOpen] = useState(false);
	const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSortMenuAnchor(event.currentTarget);
	};
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null);
	};

	const handleSortItemClick = (item: SortItem) => {
		setSortMenuAnchor(null);
		onChangeSort(item.value);
	};

	const handleFiltersModalOpen = () => {
		setFiltersModalOpen(true);
	};

	const handleFiltersModalClose = () => {
		setFiltersModalOpen(false);
	};

	return (
		<>
			<Box
				display='flex'
				flexDirection={{ xs: 'column', md: 'row' }}
				justifyContent='space-between'
				mb={{ xs: 2, md: 0 }}
				alignItems={{ xs: 'flex-start', md: 'center' }}
			>
				<Typography mb={1} variant='h6'>
					{seo?.h1}
				</Typography>
				<Button
					sx={{ display: { xs: 'flex', md: 'none' } }}
					fullWidth
					startIcon={<OptionsIcon />}
					variant='outlined'
					color='primary'
					onClick={handleFiltersModalOpen}
				>
					Параметры поиска
				</Button>
				<Box
					mt={{ xs: 1, md: 0 }}
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					width={{ xs: '100%', md: 'auto' }}
				>
					<Box display={{ xs: 'flex', md: 'none' }} gap={0.5}>
						<Typography color='custom.text-muted'> Всего запчастей: </Typography>
						<Typography fontWeight={500}>{total?.toLocaleString()}</Typography>
					</Box>
					<Button variant='text' endIcon={<ChevronDownIcon />} color='primary' onClick={handleSortMenuOpen}>
						{selectSortItems.find((item) => item.value === sort)?.name}
					</Button>
					<Menu
						disableScrollLock
						sx={{
							'& .MuiPaper-root': {
								bgcolor: '#fff',
								mt: -0.5
							}
						}}
						anchorEl={sortMenuAnchor}
						open={Boolean(sortMenuAnchor)}
						onClose={handleSortMenuClose}
					>
						{selectSortItems.map((item) => (
							<MenuItem
								key={item.name}
								onClick={() => handleSortItemClick(item)}
								selected={sort === item.value}
							>
								{item.name}
							</MenuItem>
						))}
					</Menu>
				</Box>
			</Box>

			<Box display='flex' gap={2}>
				<Box display={{ xs: 'none', md: 'block' }} width={256} component='aside'>
					<WhiteBox p={2} withShadow>
						<Filters
							total={total}
							config={filtersConfig}
							onClickFind={onClickFind}
							values={filtersValues}
							onChangeFilterValues={onChangeFilterValues}
						></Filters>
					</WhiteBox>
					{catalogCategories.length > 0 && (
						<WhiteBox mt={2} p={1} withShadow sx={{ position: 'relative' }}>
							<Typography pl={1} variant='h6' fontWeight={700} fontSize={18}>
								Категории
							</Typography>
							{catalogCategories.map((item) => (
								<Box key={item.id}>
									<Box
										bgcolor={hoveredCategory === item ? '#E2E2E2' : 'transparent'}
										position='relative'
										sx={{ cursor: 'pointer', ':hover': { bgcolor: '#E2E2E2' } }}
										p={1}
										borderRadius={2}
										display='flex'
										gap={0.5}
										alignItems='center'
										onMouseLeave={() => {
											onChangeHoveredCategory(null);
										}}
										onMouseEnter={() => {
											onChangeHoveredCategory(item);
										}}
									>
										<Typography variant='body1' fontWeight={500}>
											{item.name}
										</Typography>
										<Typography flex={1} variant='body1' color='custom.text-muted'>
											{item.spareParts.count?.toLocaleString()}
										</Typography>
										<Box>
											<ChevronRightIcon></ChevronRightIcon>
										</Box>
										{hoveredCategory === item && relatedCatalogCategories.length > 0 && (
											<Box position='absolute' zIndex={1} top={0} left='100%' pl={1.5}>
												<WhiteBox minWidth={256} p={1} withShadow>
													{relatedCatalogCategories.map((category) => (
														<Box
															key={category.id}
															bgcolor={
																hoveredCategory === category ? '#E2E2E2' : 'transparent'
															}
															sx={{
																cursor: 'pointer',
																':hover': { bgcolor: '#E2E2E2' },
																borderRadius: 2
															}}
															p={1}
														>
															<Box display='flex' gap={0.5} alignItems='center'>
																<Typography variant='body2' fontWeight={500}>
																	{category.name}
																</Typography>
																<Typography
																	flex={1}
																	variant='body2'
																	color='custom.text-muted'
																>
																	{category.spareParts.count?.toLocaleString()}
																</Typography>
															</Box>
														</Box>
													))}
												</WhiteBox>
											</Box>
										)}
									</Box>
								</Box>
							))}
						</WhiteBox>
					)}
				</Box>
				<Box flex={1}>
					{(!filtersValues.brand || !filtersValues.model) && !isMobile && (
						<Box
							mb={2}
							boxShadow='0px 10px 25px 0px #1018281F'
							px={2}
							py={4}
							minHeight={360}
							display='flex'
							flexDirection='column'
							flexWrap='wrap'
							height={360}
							gap={2}
							borderRadius={4}
							border='1px solid #D0D5DD'
							bgcolor='#EEEEEE'
						>
							{!filtersValues.brand &&
								brands.map((brand) => (
									<Box py={1} display='flex' gap={0.5} key={brand.id}>
										<Link href={`/spare-parts/${brand.slug}`}>{brand.name}</Link>
										<Typography color='custom.text-muted'>{brand.spareParts?.count}</Typography>
									</Box>
								))}
							{filtersValues.brand &&
								!filtersValues.model &&
								models.map((model) => (
									<>
										{model.generations?.map((generation) => (
											<Box display='flex' gap={0.5} py={1} key={generation.id}>
												<Link
													href={`/spare-parts/${filtersValues.brand}/model-${model.slug}?generation=${generation.slug}`}
												>
													{model.name} {generation.name}
												</Link>
												<Typography color='custom.text-muted'>
													{generation.spareParts?.count}
												</Typography>
											</Box>
										))}
									</>
								))}
						</Box>
					)}
					<Box
						display='flex'
						flexWrap='wrap'
						justifyContent={{ xs: 'center', md: 'flex-start' }}
						sx={{ opacity: isLoading ? 0.5 : 1 }}
						gap={1}
						mb={2}
					>
						{data.length ? (
							data.map((item) => (
								<ProductItem
									sx={{ margin: 'initial' }}
									width={278}
									imageHeight={220}
									key={item.id}
									data={item}
								></ProductItem>
							))
						) : !isLoading ? (
							<Typography textAlign='center' variant='h5'>
								Данных не найдено
							</Typography>
						) : (
							<CircularProgress sx={{ margin: 'auto' }}></CircularProgress>
						)}
					</Box>
					<Pagination
						sx={{
							display: 'flex',
							justifyContent: 'center'
						}}
						renderItem={(params) =>
							params.page === null ? (
								<PaginationItem
									{...params}
									onClick={() => {
										window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
									}}
								>
									{params.page}
								</PaginationItem>
							) : (
								<NextLink
									shallow
									href={`${router.asPath.split('?')[0]}?${new URLSearchParams({
										...router.query,
										page: params.page.toString()
									}).toString()}`}
								>
									<PaginationItem
										{...params}
										onClick={() => {
											window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
										}}
									>
										{params.page}
									</PaginationItem>
								</NextLink>
							)
						}
						boundaryCount={1}
						page={+page}
						siblingCount={1}
						color='primary'
						count={pageCount}
						variant='text'
					/>
				</Box>
			</Box>

			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Заказать Б/У запчасти в Гродно и Беларуси
			</Typography>
			<Typography variant='body1' mb={2} sx={{ lineHeight: 2.5 }}>
				Оригинальные Б/У автозапчасти BMW в Гродно и по всей Беларуси <br />
				Ищете качественные автозапчасти? У нас — большой выбор оригинальных Б/У запчастей с разборок Европы и
				США. <br />
				Мы предлагаем надежные и доступные комплектующие, которые помогут сэкономить без потери качества. Почему
				выбирают нас? <br />
				Специализация на Б/У запчастях BMW и других марок <br />
				Проверенные детали с европейских и американских разборок <br />
				Доставка по Гродно и всей Беларуси <br />
				Помощь в подборе, честные цены, гарантия <br />
				Обеспечьте свой автомобиль надежными и оригинальными деталями — без лишних затрат! <br />
				Б/У запчасти в отличном состоянии — это разумный выбор
			</Typography>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Покупка Б/У запчастей в Гродно и Беларуси по хорошим ценам
			</Typography>
			<List sx={{ listStyleType: 'disc', pl: 2, fontSize: 14, mb: 2 }}>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Экономия бюджета: Покупая Б/У автозапчасти, вы значительно сокращаете расходы. Стоимость
					оригинальных подержанных деталей существенно ниже новых, при этом вы получаете надежные и
					совместимые комплектующие — без переплат
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Оригинальные комплектующие: Мы поставляем Б/У запчасти с минимальным пробегом, снятые с автомобилей
					с разборок Европы и США. Это 100% оригинальные детали от производителя — полная совместимость и
					высокое качество гарантированы
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Быстрый ремонт — без ожидания: Не нужно ждать поставок неделями — у нас вы можете купить нужные Б/У
					автозапчасти в Гродно с доставкой по всей Беларуси. Быстрая обработка заказов и доставка позволяют
					вам приступить к ремонту сразу
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Широкий ассортимент запчастей: В наличии — большой выбор подержанных запчастей различных годов
					выпуска и модификаций. Вы легко подберёте нужную деталь под конкретную модель
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Уверенность и удобство: Мы предоставляем гарантийный срок на проверку определённых категорий
					запчастей (4 дней на КПП, редукторы, раздатки, форсунки и 30 дней на ДВС (в сборе и без навесного
					оборудования)
				</ListItem>
			</List>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Б/У запчасти в Гродно и Беларуси – продажа с гарантией качества и по выгодным ценам
			</Typography>
			<Typography mb={2}>
				Ищете надёжные Б/У запчасти в Гродно или других городах Беларуси? В интернет-магазине Авторазборка
				Полотково ООО "Дриблинг" вы найдёте широкий выбор оригинальных запасных частей с минимальным пробегом.
				Мы предлагаем высококачественные комплектующие по доступным ценам – как для популярных моделей, так и
				для редких комплектаций. <br />
			</Typography>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Почему выбирают нас:
			</Typography>
			<List sx={{ listStyleType: 'disc', pl: 2, fontSize: 14 }}>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Все запчасти извлечены из автомобилей с низким пробегом и прошли проверку технического состояния.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Подбор деталей по VIN-номеру, году выпуска и комплектации кузова – точно и быстро.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Постоянное обновление ассортимента и возможность заранее узнать о наличии нужной позиции.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Профессиональная консультация и поддержка на всех этапах покупки.
				</ListItem>
			</List>
			<Typography lineHeight={2.5}>
				Доставка по Гродно и всей Беларуси. <br />
				Наш магазин работает ежедневно: <br />
				Будние дни – с 10:00 до 18:00 <br />
				Выходные – с 10:00 до 14:00 <br />
				Связаться с нами можно через сайт, мессенджеры или социальные сети. <br />
				Авторазборка Полотково ООО "Дриблинг" – ваш проверенный поставщик оригинальных Б/У автозапчастей
			</Typography>

			<Modal
				sx={{
					overflow: 'auto'
				}}
				open={filtersModalOpen}
				onClose={handleFiltersModalClose}
			>
				<ModalContainer
					width={'calc(100% - 1em)'}
					sx={{
						m: 1,
						position: 'relative',
						top: '50%',
						transform: 'translateY(-50%)'
					}}
					onClose={handleFiltersModalClose}
					title='Параметры поиска'
				>
					<Box pt={2}>
						<Filters
							total={total}
							config={filtersConfig}
							onClickFind={() => {
								onClickFind();
								handleFiltersModalClose();
							}}
							values={filtersValues}
							onChangeFilterValues={onChangeFilterValues}
						/>
					</Box>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default Catalog;
