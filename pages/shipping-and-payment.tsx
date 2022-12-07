import { FC } from 'react';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPageShippingAndPayment } from 'api/pageShippingAndPayment/pageShippingAndPayment';
import { PageShippingAndPayment } from 'api/pageShippingAndPayment/types';
import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';

interface Props {
	page: PageShippingAndPayment;
}

const ShippingAndPayment: FC<Props> = ({ page }) => {
	return (
		<WhiteBox>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1 || 'Доставка/Оплата'}
			</Typography>
			<Typography gutterBottom variant='subtitle1'>
				Доставка б/у запчастей может быть в осуществлена в Минск, Гомель, Брест, Витебск, Могилев и любой другой
				населенный пункт Беларуси при помощи транспортных компаний либо почтовой службы. Каждый вариант доставки
				подбирается в индивидуальном порядке исходя из транспортной доступности, стоимости и скорости доставки.
			</Typography>
			<Typography gutterBottom variant='subtitle1'>
				Возможна бесплатная доставка по городу Гродно.
			</Typography>
			<Typography gutterBottom variant='h6'>
				Способы оплаты:
			</Typography>
			<Typography paddingLeft='1em' gutterBottom variant='subtitle1'>
				Наличные средства <br></br> Банковская карта <br></br>
				Безналичный расчет (для юридических лиц)
			</Typography>
		</WhiteBox>
	);
};

export default ShippingAndPayment;

export const getStaticProps = getPageProps(fetchPageShippingAndPayment);
