import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';

interface Props {
	page: DefaultPage & { content: string };
}

const Contacts = ({ page }: Props) => {
	return (
		<WhiteBox>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1 || 'Контакты'}
			</Typography>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</WhiteBox>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('contact'));
