import { Typography } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
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
	const hasAdditionalDescription = 'additionalDescription' in page && page.additionalDescription;
	const hasTextAfterDescription = 'textAfterDescription' in page && page.textAfterDescription;

	return (
		<>
			<AnyQuestionsLeft sx={{ width: { xs: '100%', md: 'fit-content' } }} />
			{hasAdditionalDescription && <ReactMarkdown content={page.additionalDescription} />}
			{hasTextAfterDescription && <ReactMarkdown content={page.textAfterDescription} />}
		</>
	);
};
