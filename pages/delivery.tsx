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
		<WhiteBox>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1}
			</Typography>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</WhiteBox>
	);
};

export default InstallmentPlan;

export const getStaticProps = getPageProps(fetchPage('delivery'));
