import { FC } from 'react';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPageShippingAndPayment } from 'api/pageShippingAndPayment/pageShippingAndPayment';
import { PageShippingAndPayment } from 'api/pageShippingAndPayment/types';
import WhiteBox from 'components/WhiteBox';
import { getStaticSeoProps } from 'services/StaticPropsService';
import HeadSEO from 'components/HeadSEO';

interface Props {
	data: PageShippingAndPayment;
}

const ShippingAndPayment: FC<Props> = ({ data }) => {
	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Доставка и оплата'}
				description={
					data.seo?.description || 'Доставка и оплата товаров'
				}
				keywords={
					data.seo?.keywords ||
					'оплата, доставка, способы оплаты, расчет, доставка запчастей'
				}></HeadSEO>
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

export const getStaticProps = getStaticSeoProps(fetchPageShippingAndPayment);
