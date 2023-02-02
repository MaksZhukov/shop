import { FC } from 'react';

import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import { Box, Container } from '@mui/system';
import Typography from 'components/Typography';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import BlockImages from 'components/BlockImages';

const DELIVERY_OTHER_CITIES = [
	{ text: 'Время доставки', value: '1-2 рабочих дня' },
	{
		text: 'Стоимость доставки до пунктов выдачи Автолайтэкспресс',
		value: 'от 5 рублей, по указанному адресу от 10 рублей.',
	},
];

const DELIVERY_GRONDO = [
	{
		text: 'При сумме заказа более 20руб. доставка по г.Гродно ',
		value: 'БЕСПЛАТНО',
	},
	{
		text: 'Стоимость доставки',
		value: '2 руб. при сумме покупки до 20руб',
	},
	{
		text: 'Стандартная доставка по г. Гродно',
		value: 'с 19:00 до 22:00 ПН-ПТ (Суббота по договорённости).',
	},
	{
		text: 'Оплата',
		value: 'Банковской картой на сайте Наличными или картой при получении',
	},
];

interface Props {
	page: DefaultPage & { content: string };
}

const Delivery: FC<Props> = ({ page }) => {
	return (
		<>
			<Container>
				<Box marginBottom='4em' display='flex'>
					<Image width={500} height={360} src='/delivery_img.png' isOnSSR={false} alt={'Delivery'}></Image>
					<Box marginLeft='2.5em'>
						<Typography variant='h3' fontWeight='500' marginBottom='1em' component='h1'>
							Доставка запчастей бу
						</Typography>
						<Typography>
							Если Вы видите знак на карточке товара [ *Бесплатная доставка ] – данный товар может быть
							доставлен в ближайшее отделение ОПС ЕвроПочты за сумму указанную в карточке товара, без
							оплаты стоимости доставки! Для заказа используйте кнопку “Быстрый заказ”.
						</Typography>
					</Box>
				</Box>
			</Container>
			<BlockImages imageSRCs={['/delivery_img.png', '/delivery_img.png', '/delivery_img.png']}></BlockImages>
			<Container>
				<Typography marginTop='1em' textTransform='uppercase' withSeparator component='h2' variant='h4'>
					Доставка в другие города (по Беларуси)
				</Typography>
				<Table sx={{ marginY: '2em', maxWidth: 930 }}>
					<TableBody>
						{DELIVERY_OTHER_CITIES.map((item) => (
							<TableRow key={item.value}>
								<TableCell width={600}>
									<Typography whiteSpace='nowrap'>{item.text}</Typography>
								</TableCell>
								<TableCell>
									<Typography fontWeight='500'>{item.value}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Box>
					<Typography marginTop='1em' textTransform='uppercase' withSeparator component='h2' variant='h4'>
						Курьером по Гродно
					</Typography>
					<Table sx={{ marginY: '2em', maxWidth: 1030 }}>
						<TableBody>
							{DELIVERY_GRONDO.map((item) => (
								<TableRow key={item.value}>
									<TableCell width={600}>
										<Typography whiteSpace='nowrap'>{item.text}</Typography>
									</TableCell>
									<TableCell>
										<Typography fontWeight='500'>{item.value}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
				<Typography marginTop='1em' withSeparator component='h2' variant='h4' textTransform='uppercase'>
					Пересылка по беларуси
				</Typography>
				<Box marginBottom='4em' display='flex' paddingTop='2em' alignItems='center'>
					<Box paddingRight='3em'>
						<Typography marginBottom='1em'>
							Доставка до ОПС ЕвроПочта отправлений весом до 10кг. – 4руб.
						</Typography>
						<Typography fontWeight='500'>
							Перед выбором данного метода доставки обязательно ознакомьтесь со списком почтовых отделений
							и выберите наиболее подходящее для вас отделение
						</Typography>
					</Box>
					<Box>
						<Image
							width={300}
							height={52}
							src='/delivery_europochta.png'
							isOnSSR={false}
							alt={'Delivery Europochta'}
						></Image>
					</Box>
				</Box>
			</Container>
			<BlockImages
				imageSRCs={['/delivery_img.png', '/delivery_img.png', '/delivery_img.png']}
				sx={{ marginBottom: '-3em' }}
			></BlockImages>
		</>
	);
};

export default Delivery;

export const getStaticProps = getPageProps(fetchPage('delivery'), () => ({
	hasGlobalContainer: false,
	hideSEOBox: true,
}));
