import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
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

export const getStaticProps = getPageProps(fetchPage('about'));
