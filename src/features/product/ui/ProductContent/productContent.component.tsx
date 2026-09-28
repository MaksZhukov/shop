import { AnyQuestionsLeft } from 'shared/ui';
import type {
	PageProduct,
	PageProductCabin,
	PageProductSparePart,
	PageProductTire,
	PageProductWheel
} from 'entities/page';

interface Props {
	page: PageProduct & (PageProductCabin | PageProductSparePart | PageProductTire | PageProductWheel);
}

export const ProductContent = ({ page }: Props) => {
	return (
		<>
			<AnyQuestionsLeft sx={{ width: { xs: '100%', md: 'fit-content' } }} />
		</>
	);
};
