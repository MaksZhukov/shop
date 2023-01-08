import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: DefaultPage & { content: string };
}

const Guarantee = ({ page }: Props) => {
	return (
		<WhiteBox>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1 || 'Гарантия'}
			</Typography>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</WhiteBox>
	);
};

export default Guarantee;

export const getStaticProps = getPageProps(fetchPage('guarantee'));
