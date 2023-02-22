import { Box, Typography, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArticle } from 'api/articles/articles';
import { Article as IArticle } from 'api/articles/types';

import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
    page: IArticle;
}

const Article: NextPage<Props> = ({ page }) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    return (
        <WhiteBox>
            <Typography component="h1" variant="h4" gutterBottom>
                {page.name}
            </Typography>
            <Box>
                <Box
                    sx={{
                        marginRight: { xs: 0, sm: '1em' },
                        marginBottom: { xs: '1em', sm: 0 },
                        float: 'left'
                    }}>
                    <Image
                        title={page.image?.caption}
                        alt={page.image?.alternativeText}
                        width={isMobile ? 500 : 640}
                        height={isMobile ? 375 : 480}
                        src={isMobile ? page.image?.formats?.small.url || '' : page.image?.url || ''}
                        style={{ height: 'auto' }}></Image>
                </Box>
                <ReactMarkdown content={page.description}></ReactMarkdown>
                <Box sx={{ clear: 'both' }}></Box>
            </Box>
        </WhiteBox>
    );
};

export default Article;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
    page: (await fetchArticle(context.params?.slug as string)).data.data
}));
