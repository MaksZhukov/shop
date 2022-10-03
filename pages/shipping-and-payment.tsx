import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import WhiteBox from 'components/WhiteBox';
import Head from 'next/head';

const ShippingAndPayment = () => {
	return (
		<>
			<Head>
				<title>Доставка и оплата</title>
				<meta
					name='description'
					content='Доставка и оплата товаров'></meta>
				<meta
					name='keywords'
					content='оплата, доставка, способы оплаты, расчет, доставка запчастей'
				/>
			</Head>
			<Container>
				<WhiteBox>
					<Typography
						gutterBottom
						component='h1'
						variant='h4'
						textAlign='center'>
						Доставка/Оплата
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Доставка б/у запчастей может быть в осуществлена в
						Минск, Гомель, Брест, Витебск, Могилев и любой другой
						населенный пункт Беларуси при помощи транспортных
						компаний либо почтовой службы. Каждый вариант доставки
						подбирается в индивидуальном порядке исходя из
						транспортной доступности, стоимости и скорости доставки.
					</Typography>
					<Typography gutterBottom variant='subtitle1'>
						Возможна бесплатная доставка по городу Гродно.
					</Typography>
					<Typography gutterBottom variant='h6'>
						Способы оплаты:
					</Typography>
					<Typography
						paddingLeft='1em'
						gutterBottom
						variant='subtitle1'>
						Наличные средства <br></br> Банковская карта <br></br>
						Безналичный расчет (для юридических лиц)
					</Typography>
				</WhiteBox>
			</Container>
		</>
	);
};

export default ShippingAndPayment;

export async function getStaticProps() {
	return { props: {} };
}
