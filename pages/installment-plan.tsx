import { FC } from 'react';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';

interface Props {
	page: DefaultPage & { content: string };
}

const InstallmentPlan: FC<Props> = ({ page }) => {
	return (
		<>
			<HeadSEO
				title={page.seo?.title}
				description={page.seo?.description}
				keywords={page.seo?.keywords}
			></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
						{page.seo?.h1}
					</Typography>
					<ReactMarkdown content={page.content}></ReactMarkdown>
				</WhiteBox>
				<SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default InstallmentPlan;

export const getStaticProps = getPageProps(fetchPage('installment-plan'));
