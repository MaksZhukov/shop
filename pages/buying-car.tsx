import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPageBuyingCar } from 'api/pageBuyingCar/pageBuyingCar';
import { PageBuyingCar } from 'api/pageBuyingCar/types';
import HeadSEO from 'components/HeadSEO';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { getStaticSeoProps } from 'services/StaticPropsService';

interface Props {
	data: PageBuyingCar;
}

const BuyingCar: NextPage<Props> = ({ data }) => {
	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Покупка автмобилей на запчасти'}
				description={
					data.seo?.description ||
					'Описание покупки автмобилей на запчасти'
				}
				keywords={
					data.seo?.keywords ||
					'покупка на запчасти, покупка авто на запчасти, покупка автомобилей на запчасти, автозапчасти, авто в пути'
				}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography
						gutterBottom
						component='h1'
						variant='h4'
						textAlign='center'>
						Покупка автмобилей на запчасти
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						У автолюбителей зачастую возникает необходимость продать
						авто на разборку, ведь других рациональных вариантов её
						продажи попросту не существует. Это может быть и битый,
						и неремонтопригодный автомобиль. К тому же немногие
						владельцы рискнут продавать автомобиль по частям в
						течение длительного времени.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Тем более нужно соблюдать определенные требования по
						утилизации автомобилей в Беларуси, так как просто
						бросить транспортное средство не получится. А стоит эта
						процедура может тоже немало, если не были учтены нормы
						законодательства. Существует и потеря времени на весь
						данный процесс, что также немаловажно для многих
						автолюбителей.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Регламентирует порядок утилизации авто в Беларуси указ
						Президента №348 от 09.08.2011 “О мерах по организации
						сбора, хранения неэксплуатируемых транспортных средств и
						их последующей утилизации”.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Не каждому будет интересно потратить больше средств на
						утилизацию, чем заработать на продаже б/у запчастей от
						машины, тем более целиком избавиться от неё не
						получится. Например, чтобы сдать автомобиль на
						металлолом, его нужно предварительно подготовить, т.е.
						слить все жидкости, снять колеса, стекла, пластиковые
						детали, амортизаторы, потратить деньги на его доставку.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Поэтому оптимальным вариантом будет сдать авто на
						разборку. Для этого лучше всего обратиться к
						специалистам авторазборки в Гродно, которые и
						разберутся, каким образом можно будет купить Ваш
						автомобиль.
					</Typography>
					<Typography gutterBottom variant='h6'>
						Чтобы продать авто на разборку Полотково в Гродно, от
						владельца требуется:
					</Typography>
					<Typography
						paddingLeft='1em'
						gutterBottom
						variant='subtitle1'>
						- снять автомобиль с учета в ГАИ; <br></br> - позвонить
						сотрудниками авторазборки (+375 29 601-16-02 или +375 29
						780-4-780);<br></br> - прислать им по возможности фото
						машины, сообщить её характеристики;
						<br></br> - предварительно согласовать, сколько будет
						стоить выкуп авто;
						<br></br>- согласовать время, когда сотрудники
						гродненской авторазборки Полотково приедут забрать Ваш
						автомобиль (деньги за это чаще всего не взымаются).
						Можно доставить машину на авторазборку и самостоятельно.
						Прием авто на разборку осуществляется в любой день
						недели.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Если автомобиль без документов, то нужно обсудить и
						согласовать с работниками авторазборки Полотково
						дополнительные условия покупки такой машины у её
						владельца.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Возможно сдать авто на разборку с любого региона
						Беларуси. Все условия продажи обсуждаются в
						индивидуальном порядке.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Поэтому продать авто на разборку в Гродно можно очень
						быстро и по выгодной цене.
					</Typography>
				</WhiteBox>
			</Container>
		</>
	);
};

export default BuyingCar;

export const getStaticProps = getStaticSeoProps(fetchPageBuyingCar);
