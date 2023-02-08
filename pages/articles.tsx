import { Box, Pagination, PaginationItem } from '@mui/material';
import { fetchArticles } from 'api/articles/articles';
import { Article, Article as IArticle } from 'api/articles/types';
import { ApiResponse } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import CardItem from 'components/CardItem';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import NextLink from 'next/link';
import Typography from 'components/Typography';

let LIMIT = 10;

interface Props {
    page: DefaultPage;
    articles: ApiResponse<Article[]>;
}

const Articles: NextPage<Props> = ({ page, articles }) => {
    const [data, setData] = useState<Article[]>(articles ? articles.data : []);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const pageCount = articles?.meta?.pagination?.pageCount ?? 0;
    const router = useRouter();

    const { page: qPage = '1' } = router.query as {
        page: string;
    };

    useEffect(() => {
        if (isMounted) {
            const fetchData = async () => {
                const {
                    data: { data }
                } = await fetchArticles({
                    pagination: {
                        start: qPage === '1' ? 0 : +qPage * LIMIT,
                        limit: LIMIT
                    },
                    populate: 'image'
                });
                setData(data);
            };
            fetchData();
        }
        setIsMounted(true);
    }, [qPage]);

    return (
        <>
            <Typography withSeparator textTransform="uppercase" component="h1" variant="h4" marginBottom="1em">
                {page.seo?.h1 || 'Статьи'}
            </Typography>
            {data.map((item) => (
                <CardItem
                    key={item.id}
                    description={item.description}
                    name={item.name}
                    image={item.image}
                    link={`/articles/${item.slug}`}></CardItem>
            ))}
            {pageCount > 1 && (
                <Box display="flex" justifyContent="center">
                    <Pagination
                        page={+qPage}
                        renderItem={(params) => (
                            <NextLink shallow href={`${router.pathname}?page=${params.page}`}>
                                <PaginationItem {...params}>{params.page}</PaginationItem>
                            </NextLink>
                        )}
                        siblingCount={2}
                        color="primary"
                        count={pageCount}
                        variant="outlined"
                    />
                </Box>
            )}
        </>
    );
};

export default Articles;

export const getServerSideProps = getPageProps(fetchPage('article'), async (context) => {
    const start = !context.query?.page || context.query?.page === '1' ? 0 : +context.query.page * LIMIT;
    return {
        articles: (
            await fetchArticles({
                pagination: {
                    start,
                    limit: LIMIT
                },
                populate: 'image'
            })
        ).data
    };
});
