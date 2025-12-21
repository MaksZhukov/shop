import { Brand } from '../brandTypes';
import { WhiteBox } from 'shared/ui';
import { LinkWithImage } from 'shared/ui';

interface BrandItemProps {
	brand: Brand;
}

export const BrandItem = ({ brand }: BrandItemProps) => {
	return (
		<WhiteBox p={1} height={128} width={110}>
			<LinkWithImage
				width={110}
				height={80}
				caption={brand.name}
				link={`/spare-parts/${brand.slug}`}
				image={brand.image}
				typographyProps={{ fontWeight: 'bold', variant: 'body1' }}
			></LinkWithImage>
		</WhiteBox>
	);
};
