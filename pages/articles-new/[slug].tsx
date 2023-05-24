import { Box, Typography, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArticle } from 'api/articles/articles';
import { fetchArticleNew } from 'api/articlesNew/articlesNew';
import { ArticleNew as IArticleNew } from 'api/articlesNew/types';

import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
    page: IArticleNew;
}

const Article: NextPage<Props> = ({ page }) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    return (
        <WhiteBox>
            <Typography component='h1' variant='h4' gutterBottom>
                {page.name}
            </Typography>
            <Box></Box>
        </WhiteBox>
    );
};

export default Article;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
    page: (await fetchArticleNew(context.params?.slug as string)).data.data
}));
