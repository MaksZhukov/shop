import { Box, Pagination, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { fetchArticles } from "api/articles/articles";
import { Article, Article as IArticle } from "api/articles/types";
import { fetchPageArticles } from "api/pageArticles/pageArticles";
import { PageArticles } from "api/pageArticles/types";
import { MetaResponse } from "api/types";
import HeadSEO from "components/HeadSEO";
import Image from "components/Image";
import SEOBox from "components/SEOBox";
import WhiteBox from "components/WhiteBox";
import { NextPage } from "next";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useState } from "react";
import { getPageProps } from "services/PagePropsService";

const { publicRuntimeConfig } = getConfig();

interface Props {
  data: PageArticles;
  articlesData: { articles: IArticle[]; meta: MetaResponse };
}

const Articles: NextPage<Props> = ({ data, articlesData }) => {
  const [articles, setArticles] = useState<Article[]>(articlesData.articles);
  const [pageCount, setPageCount] = useState<number>(
    articlesData.meta.pagination?.pageCount ?? 0
  );
  const router = useRouter();

  const { page = "1" } = router.query as {
    page: string;
  };

  const handleChangePage = async (_: any, newPage: number) => {
    router.query.page = newPage.toString();
    router.push({ pathname: router.pathname, query: router.query }, undefined, {
      shallow: true,
    });
    const {
      data: { data },
    } = await fetchArticles({
      pagination: { page: +newPage },
      populate: "image",
    });
    setArticles(data);
  };
  return (
    <Container>
      <HeadSEO
        title={data.seo?.title || "Статьи"}
        description={data.seo?.description || "Статью"}
        keywords={data.seo?.keywords || "статья"}
      ></HeadSEO>

      <WhiteBox>
        <Typography
          textAlign="center"
          component="h1"
          variant="h4"
          marginBottom="1em"
        >
          {data.seo?.h1 || "Статьи"}
        </Typography>
        {articles.map((item) => (
          <Box marginBottom="1em" key={item.id}>
            <Image
              alt={item.image.alternativeText}
              width={640}
              height={480}
              src={
                publicRuntimeConfig.backendLocalUrl +
                item.image.formats?.small.url
              }
            ></Image>
            <Typography>{item.name}</Typography>
            <Typography>{item.type}</Typography>
          </Box>
        ))}
        <Box display="flex" justifyContent="center">
          <Pagination
            page={+page}
            siblingCount={2}
            color="primary"
            count={3}
            onChange={handleChangePage}
            variant="outlined"
          />
        </Box>
      </WhiteBox>
      <SEOBox images={data.seo?.images} content={data.seo?.content}></SEOBox>
    </Container>
  );
};

export default Articles;

export const getServerSideProps = getPageProps(fetchPageArticles, async () => {
  const { data } = await fetchArticles(
    { pagination: { limit: 10 }, populate: "image" },
    true
  );
  console.log("hello");
  return { articlesData: { articles: data.data, meta: data.meta } };
});
