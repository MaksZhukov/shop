import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageContacts } from 'api/pageContacts/pageContacts';
import { PageContacts } from 'api/pageContacts/types';
import HeadSEO from 'components/HeadSEO';
import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import SEOBox from 'components/SEOBox';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';

interface Props {
	page: DefaultPage & { content: string };
}

const Contacts = ({ page }: Props) => {
	return (
		<WhiteBox>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</WhiteBox>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('contact'));
