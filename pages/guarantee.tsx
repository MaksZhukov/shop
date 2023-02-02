import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/Image';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: DefaultPage & { content: string };
}

const Guarantee = ({ page }: Props) => {
	return (
		<>
			<Container>
				<Box display='flex'>
					<Image src={'/guarantee_img.png'} isOnSSR={false} width={500} height={360} alt='Guarantee'></Image>
					<Box>
						<Typography>Гарантия на б/у запчасти</Typography>
						Гарантия на б/у запчасти, приобретенные на авторазборке Полотково в Гродно, составляет 14
						календарных дней. Гарантия распространяется на:
						<Typography component='ul'>
							<Typography component='li'>двигатель</Typography>
							<Typography component='li'>навесное оборудование электронные механизмы</Typography>
							<Typography component='li'>электронные блоки</Typography>
							<Typography component='li'>МКПП/АКПП</Typography>
							<Typography component='li'>колёсные диски</Typography>
						</Typography>
					</Box>
				</Box>
			</Container>
			<BlockImages imageSRCs={['/guarantee_img.png', '/guarantee_img.png', '/guarantee_img.png']}></BlockImages>
			<Container>
				<Typography>Гарантия не распространяется на:</Typography>
				<Typography>
					детали подвески, радиаторы, оптику, стекла, кузовные детали, колеса, шины, зеркала, фары, фонари,
					проводку, пластиковые детали салона, различного рода обшивки, на прокладки, сальники, ремни ГРМ,
					ролики, а так же любые резиновые детали, входящие в состав агрегата, салона и прочие детали. товары,
					проданные с дефектами, о которых покупатель был предупрежден перед покупкой. Возврат и обмен
					Стандартный срок возврата запчастей составляет 14 календарных дней со дня покупки. товара. На
					протяжении гарантийного срока товар подлежит бесплатному обмену на аналогичный или может быть
					осуществлен возврат стоимости Специальные отметки При приобретении сложных б/у запчастей, таких,
					как: коробки передач, коробки раздаточные, редукторы, детали двигателей, детали навесного
					оборудования двигателей, электронные блоки - специалисты нашей организации наносят специальные
					отметки краской. При установке деталей на автомобиль, запрещается смывать, уничтожать, снимать или
					частично повреждать эти отметки.
				</Typography>
			</Container>
			<BlockImages
				imageSRCs={['/guarantee_img.png', '/guarantee_img.png', '/guarantee_img.png']}
				sx={{ bgcolor: 'transparent', padding: 0, marginY: '2em' }}
			></BlockImages>
			<Container>
				<Box bgcolor='#FFF5DD' padding='2em 3em'>
					<Typography>Возврат запчастей осуществляется при выполнении следующих условий</Typography>
					<Box display='flex'>
						<Image isOnSSR={false} src='/warning.png' width={160} height={160} alt='Warning'></Image>
						<Box component='ul'>
							<Typography component='li'>сохранение внешнего вида</Typography>
							<Typography component='li'>сохранение защитных пломб</Typography>
							<Typography component='li'>сохранение маркировки</Typography>
							<Typography component='li'>комплектность</Typography>
							<Typography component='li'>
								имеются доказательства приобретения на гродненской авторазборке Полотково Товар возврату
								не подлежит в случае: истечения гарантийного срока
							</Typography>
							<Typography component='li'>отсутствия (повреждении) меток продавца</Typography>
							<Typography component='li'>отсутствия или утери чека</Typography>
						</Box>
					</Box>
				</Box>
				<Typography>
					В случае возврата приобретённых б/у запчастей, затраты клиента, связанные с его установкой и
					транспортировкой, авторазборка Полотково в Гродно не компенсирует.
				</Typography>
				<Typography>C уважением, магазин б/у запчастей для автомобиля.</Typography>
			</Container>
		</>
	);
};

export default Guarantee;

export const getStaticProps = getPageProps(fetchPage('guarantee'), () => ({
	hasGlobalContainer: false,
	hideSEOBox: true,
}));
