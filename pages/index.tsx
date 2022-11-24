import type { NextPage } from "next";
import { fetchSpareParts } from "api/spareParts/spareParts";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Slider from "react-slick";
import { Brand } from "api/brands/types";
import { Model } from "api/models/types";
import { KindSparePart } from "api/kindSpareParts/types";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import {
  ApiResponse,
  Filters as IFilters,
  LinkWithImage as ILinkWithImage,
} from "api/types";
import { MAX_LIMIT } from "api/constants";
import { fetchBrands } from "api/brands/brands";
import { fetchModels } from "api/models/models";
import { fetchKindSpareParts } from "api/kindSpareParts/kindSpareParts";
import { useSnackbar } from "notistack";
import { fetchGenerations } from "api/generations/generations";
import { Generation } from "api/generations/types";
import { getPageProps } from "services/StaticPropsService";
import { fetchPageMain } from "api/pageSpareParts/pageSpareParts";
import HeadSEO from "components/HeadSEO";
import SEOBox from "components/SEOBox";
import Filters from "components/Filters";
import styles from "./index.module.scss";
import { PageMain } from "api/pageMain/types";
import WhiteBox from "components/WhiteBox";
import Link from "next/link";
import Image from "next/image";
import getConfig from "next/config";
import LinkWithImage from "components/LinkWithImage";
import { getSparePartsFiltersConfig } from "components/Filters/config";
import { Car } from "api/cars/types";
import { fetchCars } from "api/cars/cars";
import { fetchNews } from "api/news/news";
import { OneNews } from "./api/news";

const { publicRuntimeConfig } = getConfig();

interface Props {
  data: PageMain;
  cars: Car[];
  news: OneNews[];
}

const Home: NextPage<Props> = ({ data, cars, news }) => {
  console.log(news);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<null | number>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { meta },
      } = await fetchSpareParts();
      setTotal(meta.pagination?.total || 0);
    };
    fetchData();
  }, []);

  const { brandId = "", modelId = "" } = router.query as {
    brandId: string;
    modelId: string;
  };
  const handleOpenAutocomplete =
    <T extends any>(
      hasData: boolean,
      setState: Dispatch<SetStateAction<T[]>>,
      fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
    ) =>
    async () => {
      if (!hasData) {
        setIsLoading(true);
        try {
          const {
            data: { data },
          } = await fetchFunc();
          setState(data);
        } catch (err) {
          enqueueSnackbar(
            "Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку",
            { variant: "error" }
          );
        }
        setIsLoading(false);
      }
    };

  const handleChangeBrandAutocomplete = (_: any, selected: Brand | null) => {
    if (selected) {
      router.query.brandName = selected.name.toString();
      router.query.brandId = selected.id.toString();
    } else {
      delete router.query.brandName;
      delete router.query.brandId;
      delete router.query.modelName;
      delete router.query.modelId;
      delete router.query.generationId;
      delete router.query.generationName;
    }
    router.push({ pathname: router.pathname, query: router.query });
    setModels([]);
  };

  const handleClickFind = () => {};

  const noOptionsText = isLoading ? (
    <CircularProgress size={20} />
  ) : (
    <>Совпадений нет</>
  );

  const handleOpenAutocompleteBrand = handleOpenAutocomplete<Brand>(
    !!brands.length,
    setBrands,
    () =>
      fetchBrands({
        pagination: { limit: MAX_LIMIT },
      })
  );

  const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(
    !!models.length,
    setModels,
    () =>
      fetchModels({
        filters: { brand: brandId as string },
        pagination: { limit: MAX_LIMIT },
      })
  );

  const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
    !!generations.length,
    setGenerations,
    () =>
      fetchGenerations({
        filters: { model: modelId as string },
        pagination: { limit: MAX_LIMIT },
      })
  );

  const handleOpenAutocompleteKindSparePart =
    handleOpenAutocomplete<KindSparePart>(
      !!kindSpareParts.length,
      setKindSpareParts,
      () =>
        fetchKindSpareParts({
          pagination: { limit: MAX_LIMIT },
        })
    );

  const filtersConfig = getSparePartsFiltersConfig({
    brands,
    models,
    kindSpareParts,
    generations,
    modelId,
    brandId,
    noOptionsText,
    onOpenAutoCompleteBrand: handleOpenAutocompleteBrand,
    onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
    onOpenAutocompleteModel: handleOpenAutocompleteModel,
    onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
    onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
  });

  const renderLinkWithImage = (item: ILinkWithImage) => (
    <WhiteBox key={item.id} textAlign="center">
      <LinkWithImage
        targetLink="_blank"
        image={item.image}
        link={item.link}
      ></LinkWithImage>
    </WhiteBox>
  );

  const renderLinksWithImages = (items?: ILinkWithImage[]) =>
    items?.map((item) => renderLinkWithImage(item));

  return (
    <>
      <HeadSEO
        title={data.seo?.title || "Главная"}
        description={data.seo?.description || "разборка"}
        keywords={data.seo?.keywords || "главная, разборка"}
      ></HeadSEO>
      <Container>
        <WhiteBox>
          <Typography
            textTransform="capitalize"
            component="h1"
            variant="h4"
            textAlign="center"
          >
            {data.seo?.h1 || "Магазин запчастей б/у для автомобилей"}
          </Typography>
        </WhiteBox>
        <Box display="flex">
          <Box
            marginRight="1em"
            component="aside"
            className={styles["sider-left"]}
          >
            <Filters
              config={filtersConfig}
              total={total}
              totalText={`Найдено запчастей`}
              btnText="Перейти в каталог"
              onClickFind={handleClickFind}
            ></Filters>
            {renderLinksWithImages(data.serviceStations)}
            {renderLinksWithImages(data.autocomises)}
            {data.deliveryAuto && renderLinkWithImage(data.deliveryAuto)}
          </Box>
          <Box flex="1"></Box>
          <Box className={styles["sider-right"]}>
            <WhiteBox padding="1em 1.5em">
              <Slider>
                {cars
                  .filter((item) => item.images)
                  .map((item) => (
                    <Slider
                      arrows={false}
                      key={item.id}
                      autoplay
                      autoplaySpeed={3000}
                    >
                      {item.images?.map((image) => (
                        <Image
                          alt={image.alternativeText}
                          key={image.id}
                          width={208}
                          height={156}
                          src={
                            publicRuntimeConfig.backendLocalUrl +
                            image.formats?.thumbnail.url
                          }
                        ></Image>
                      ))}
                    </Slider>
                  ))}
              </Slider>
            </WhiteBox>
            {renderLinksWithImages(data.discounts)}
            {renderLinksWithImages(data.advertising)}
          </Box>
        </Box>
        <SEOBox images={data.seo?.images} content={data.seo?.content}></SEOBox>
      </Container>
    </>
  );
};

export default Home;

export const getServerSideProps = getPageProps(
  fetchPageMain,
  async () => {
    const { data } = await fetchCars(
      { populate: ["images"], pagination: { limit: 10 } },
      true
    );
    return { cars: data.data };
  },
  async () => {
    const { data } = await fetchNews();
    return { news: data.data };
  }
);
