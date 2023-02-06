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
        <>
            <Typography marginBottom="1em" component="h1" textTransform="uppercase" variant="h4" textAlign="center">
                {page.seo?.h1 || 'Оплата'}
            </Typography>
            <ReactMarkdown content={page.content}></ReactMarkdown>
        </>
    );
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('payment'));
