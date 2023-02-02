import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { ApiResponse } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { fetchVacancies } from 'api/vacancies/vacancies';
import { Vacancy } from 'api/vacancies/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import CardItem from 'components/CardItem';
import { Box, Container } from '@mui/system';
import Image from 'components/Image';
import Typography from 'components/Typography';

interface Props {
	page: DefaultPage;
	vacancies: ApiResponse<Vacancy[]>;
}

const VACANCIES = [
	{
		id: 1,
		images: ['/vacancy_1.png', '/vacancy_1.png', '/vacancy_1.png', '/vacancy_1.png'],
		title: 'Вакансии в магазин запчастей в Гродно',
		vacancy: 'продавец-консультант по подбору',
		description: [
			{ label: 'Форма занятости:', value: 'Постоянная' },
			{ label: 'График работы:', value: 'Полный' },
			{ label: 'Образование:', value: 'Высшее' },
			{ label: 'Тип работодателя:', value: 'Компания' },
		],
		fullTitle:
			'Приглашаем на работу в магазин автозапчастей для автотехники продавца-консультанта (подборщика автозапчастей).',
		responsibilities: [
			'обработка заявок клиентов на подбор автозапчастей, консультирование клиентов',
			'помощь и контроль при оприходовании и отпуске запасных частей со склада',
			'ведение отчетности',
		],
		requirenments: [
			'профильное образование (автослесарь, автомеханик, автотракторный факультет и др.)',
			'знание современных моделей грузовой автотехники',
			'опыт работы автомехаником, мастером, автослесарем',
			'уверенный пользователь ПК (опыт работы с автокатологами)',
			'общительность, позитивность, ответственность, исполнительность',
		],
	},
	{
		id: 2,
		images: ['/vacancy_2.png', '/vacancy_2.png', '/vacancy_2.png', '/vacancy_2.png'],
		title: 'Вакансии в магазин запчастей в Гродно',
		vacancy: 'Требуется продавец в автомагазин',
		description: [
			{ label: 'Форма занятости:', value: 'Постоянная' },
			{ label: 'График работы:', value: 'Полный' },
			{ label: 'Образование:', value: 'Высшее' },
			{ label: 'Тип работодателя:', value: 'Компания' },
		],
		fullTitle:
			'Приглашаем на работу в магазин автозапчастей для автотехники продавца-консультанта (подборщика автозапчастей).',
		responsibilities: [
			'обработка заявок клиентов на подбор автозапчастей, консультирование клиентов',
			'помощь и контроль при оприходовании и отпуске запасных частей со склада',
			'ведение отчетности',
		],
		requirenments: [
			'знание компьютера',
			'умение вести бухгалтерский учет',
			'наличие прав на управление транспортными средствами категории "В"',
			'наличие опыта в сфере торговли',
			'общительность, позитивность, ответственность, исполнительность',
		],
	},
];

const Vacancies: NextPage<Props> = ({ page, vacancies }) => {
	let renderVacancy = (item: typeof VACANCIES[0]) => {
		let [mainImg, ...otherImgs] = item.images;
		return (
			<>
				<Container sx={{ marginBottom: '3em' }}>
					<Box key={item.id} display='flex'>
						<Image isOnSSR={false} src={mainImg} alt='alt' width={500} height={360}></Image>
						<Box paddingLeft='3em'>
							<Typography
								marginBottom='1em'
								component='h2'
								variant='h4'
								textTransform='uppercase'
								fontWeight='500'
							>
								{item.title}
							</Typography>
							<Typography
								marginBottom='2em'
								color='text.secondary'
								variant='h5'
								textTransform='uppercase'
							>
								{item.vacancy}
							</Typography>
							<Table>
								<TableBody>
									{item.description.map((option) => (
										<TableRow key={option.value}>
											<TableCell
												width={300}
												sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }}
												padding='none'
											>
												<Typography>{option.label}</Typography>
											</TableCell>
											<TableCell
												sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }}
												padding='none'
											>
												<Typography fontWeight='500'>{option.value}</Typography>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Box>
				</Container>
				<Box paddingY='3em' marginBottom='3em' bgcolor='#fff'>
					<Container>
						<Box display='flex'>
							{otherImgs.map((option) => (
								<Box key={option}>
									<Image isOnSSR={false} src={option} alt='alt' width={390} height={270}></Image>
								</Box>
							))}
						</Box>
					</Container>
				</Box>
				<Container sx={{ marginBottom: '8em' }}>
					<Typography
						marginBottom='2em'
						component='h2'
						variant='h4'
						textTransform='uppercase'
						fontWeight='500'
						withSeparator
					>
						{item.fullTitle}
					</Typography>
					<Box display='flex'>
						<Box flex='1' paddingRight='5em'>
							<Typography color='text.secondary' variant='h6' textTransform='uppercase'>
								Обязаности
							</Typography>
							<Box component='ul' padding='0'>
								{item.responsibilities.map((val) => (
									<Typography marginBottom='1em' key={val} component='li'>
										{val}
									</Typography>
								))}
							</Box>
						</Box>
						<Box flex='1' paddingRight='5em'>
							<Typography color='text.secondary' variant='h6' textTransform='uppercase'>
								Требования
							</Typography>
							<Box component='ul' padding='0'>
								{item.requirenments.map((val) => (
									<Typography marginBottom='1em' key={val} component='li'>
										{val}
									</Typography>
								))}
							</Box>
						</Box>
					</Box>
				</Container>
			</>
		);
	};
	return <>{VACANCIES.map(renderVacancy)}</>;
};

export default Vacancies;

export const getStaticProps = getPageProps(
	fetchPage('vacancy'),
	async () => ({
		vacancies: (
			await fetchVacancies({
				populate: 'image',
			})
		).data,
	}),
	() => ({
		hasGlobalContainer: false,
		hideSEOBox: true,
	})
);
