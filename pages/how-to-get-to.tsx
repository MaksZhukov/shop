import { FC } from 'react';
import { Typography } from '@mui/material';
import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';

interface Props {
    page: DefaultPage & { content: string };
}

const HowToGetTo: FC<Props> = ({ page }) => {
    return (
        <>
            <Typography marginBottom="1em" component="h1" textTransform="uppercase" variant="h4" textAlign="center">
                {page.seo?.h1}
            </Typography>
            <ReactMarkdown content={page.content}></ReactMarkdown>
        </>
    );
};

export default HowToGetTo;

export const getStaticProps = getPageProps(fetchPage('how-to-get-to'));
