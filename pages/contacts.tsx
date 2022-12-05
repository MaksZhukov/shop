import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageContacts } from 'api/pageContacts/pageContacts';
import { PageContacts } from 'api/pageContacts/types';
import HeadSEO from 'components/HeadSEO';
import WhiteBox from 'components/WhiteBox';
import Image from 'next/image';
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
		<>
			<HeadSEO
				title={page.seo?.title}
				description={page.seo?.description}
				keywords={page.seo?.keywords}
			></HeadSEO>
			<Container>
				<WhiteBox>
					<ReactMarkdown content={page.content}></ReactMarkdown>
				</WhiteBox>
				<SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('contact'));
