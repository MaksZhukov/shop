import { Box } from '@mui/material';
import { Brand } from 'api/brands/types';
import { Typography, WhiteBox } from 'components/ui';
import LinkWithImage from 'components/LinkWithImage';

interface BrandSelectionProps {
	brands: Brand[];
}

export const BrandSelection: React.FC<BrandSelectionProps> = ({ brands }) => {
	return (
		<Box mb={5}>
			<Typography textAlign={{ xs: 'center', md: 'left' }} variant='h6'>
				Выберите марку авто
			</Typography>
			<Typography textAlign={{ xs: 'center', md: 'left' }} color='text.primary' variant='body2'>
				Автозапчасти б/у на авторазборке в наличии
			</Typography>
			<Box mt={1} display={'flex'} justifyContent={{ xs: 'center', md: 'flex-start' }} flexWrap={'wrap'} gap={1}>
				{brands.map((item) => (
					<WhiteBox key={item.id} p={1} height={128} width={110}>
						<LinkWithImage
							width={110}
							height={80}
							caption={item.name}
							link={`/spare-parts/${item.slug}`}
							image={item.image}
							typographyProps={{ fontWeight: 'bold', variant: 'body1' }}
						></LinkWithImage>
					</WhiteBox>
				))}
			</Box>
		</Box>
	);
};
