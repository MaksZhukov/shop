import { Box, Typography, useMediaQuery } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import EmptyImageIcon from "components/EmptyImageIcon";
import FavoriteButton from "components/FavoriteButton";
import ShoppingCartButton from "components/ShoppingCartButton";
import WhiteBox from "components/WhiteBox";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import Image from "next/image";
import { FC, useEffect } from "react";
import Slider from "react-slick";
import { api } from "../../api";
import { fetchProduct } from "../../api/products/products";
import { Product } from "../../api/products/types";
import styles from "./product.module.scss";

const { publicRuntimeConfig } = getConfig();

interface Props {
  data: Product;
}

const ProductPage = ({ data }: Props) => {
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  let printOptions = [
    { text: "Артикул", value: data.id },
    { text: "Марка", value: data.brand?.name },
    { text: "Модель", value: data.brand?.name },
    { text: "Запчасть", value: data.sparePart?.name },
    { text: "Коробка", value: data.transmission },
    { text: "Поколение", value: data.generation },
    { text: "Обьем", value: data.volume },
  ];

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>
      <Container>
        <WhiteBox padding="2em">
          <Box
            marginBottom="1em"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h4"
              flex="1"
              overflow="hidden"
              title={data.name}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              component="h1"
            >
              {data.name}
            </Typography>
            <ShoppingCartButton product={data}></ShoppingCartButton>
            <FavoriteButton product={data}></FavoriteButton>
          </Box>
          <Box
            display="flex"
            sx={{ flexDirection: { xs: "column", md: "row" } }}
          >
            {data.images ? (
              <Slider
                autoplay
                autoplaySpeed={3000}
                dots
                className={styles.slider}
              >
                {data.images.map((item) => (
                  <Image
                    key={item.id}
                    alt={data.name}
                    width={640}
                    height={480}
                    src={publicRuntimeConfig.backendLocalUrl + item.url}
                  ></Image>
                ))}
              </Slider>
            ) : (
              <EmptyImageIcon
                size={isMobile ? 300 : isTablet ? 500 : 700}
                margin={"-8%"}
              ></EmptyImageIcon>
            )}
            <Box
              flex="1"
              display="flex"
              sx={{
                flexDirection: {
                  xs: "column-reverse",
                  sm: "row",
                  md: "column-reverse",
                  lg: "row",
                },
              }}
            >
              <Box flex="1" sx={{ padding: { xs: "0", md: "0 1em 0 3em" } }}>
                {printOptions.map((item) => (
                  <Box display="flex" key={item.value}>
                    <Typography
                      mr="1em"
                      width="80px"
                      fontWeight="500"
                      variant="subtitle1"
                      component="span"
                    >
                      {item.text}:
                    </Typography>
                    <Typography component="span">{item.value}</Typography>
                  </Box>
                ))}
              </Box>
              <Box>
                <Typography
                  textAlign="right"
                  variant="h5"
                  width="100%"
                  color="primary"
                >
                  {data.price} р.
                </Typography>
                <Typography
                  textAlign="right"
                  variant="h5"
                  width="100%"
                  color="text.secondary"
                >
                  ~ {data.priceUSD?.toFixed()} $
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography
              mr="1em"
              fontWeight="500"
              variant="subtitle1"
              component="span"
            >
              Описание:
            </Typography>
            <Typography color="text.secondary">{data.description}</Typography>
          </Box>
        </WhiteBox>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  {},
  { slug: string }
> = async (context) => {
  let data = null;
  let notFound = false;
  try {
    const response = await fetchProduct(context.params?.slug || "", true);

    data = response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      notFound = true;
    }
  }

  return {
    notFound,
    props: { data },
  };
};

export default ProductPage;
