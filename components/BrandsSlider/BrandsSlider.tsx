import { useMediaQuery } from '@mui/material';
import { Brand } from 'api/brands/types';
import LinkWithImage from 'components/LinkWithImage/LinkWithImage';
import WhiteBox from 'components/WhiteBox/WhiteBox';
import { FC } from 'react';
import Slider from 'react-slick';

interface Props {
	brands: Brand[];
}

const BrandsSlider: FC<Props> = ({ brands }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<Slider rows={isMobile ? 1 : 2} slidesToShow={isMobile ? 2 : isTablet ? 4 : 7}>
			{brands.map((item) => (
				<WhiteBox marginX='auto' marginBottom={{ xs: 0, sm: '1em' }} width={137} padding='1em 0' key={item.id}>
					<LinkWithImage
						width={100}
						height={40}
						caption={item.name}
						link={`/spare-parts/${item.slug}`}
						image={item.image}
						typographyProps={{ fontWeight: 'bold', variant: 'body1' }}
					></LinkWithImage>
				</WhiteBox>
			))}
		</Slider>
	);
};

export default BrandsSlider;
