import type { NextPage } from "next";
import Catalog from "components/Catalog";
import { CircularProgress, Container } from "@mui/material";
import { SEASONS } from "components/Filters/constants";
import { ApiResponse, Filters } from "api/types";
import { MAX_LIMIT } from "api/constants";
import Head from "next/head";
import { useState, SetStateAction, Dispatch } from "react";
import { AxiosResponse } from "axios";
import { Brand } from "api/brands/types";
import { fetchTires } from "api/tires/tires";
import { useStore } from "store";
import { useSnackbar } from "notistack";
import { fetchTireBrands } from "api/tireBrands/tireBrands";

const Tires: NextPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const store = useStore();
  const { enqueueSnackbar } = useSnackbar();

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

  const noOptionsText = isLoading ? (
    <CircularProgress size={20} />
  ) : (
    <>Совпадений нет</>
  );

  const filtersConfig = [
    [
      {
        id: "brandId",
        name: "brandName",
        placeholder: "Марка",
        disabled: false,
        type: "autocomplete",
        options: brands.map((item) => ({ label: item.name, ...item })),
        onOpen: handleOpenAutocomplete<Brand>(!!brands.length, setBrands, () =>
          fetchTireBrands({
            pagination: { limit: MAX_LIMIT },
          })
        ),
        noOptionsText: noOptionsText,
      },
    ],
    [
      {
        id: "width",
        disabled: false,
        placeholder: "Ширина",
        type: "number",
      },
      {
        id: "height",
        disabled: false,
        placeholder: "Высота",
        type: "number",
      },
    ],
    [
      {
        id: "diameter",
        placeholder: "Диаметр",
        type: "number",
        disabled: false,
      },
    ],
    [
      {
        id: "season",
        placeholder: "Сезон",
        type: "autocomplete",
        disabled: false,
        options: SEASONS,
        noOptionsText: "",
      },
    ],
  ];

  const generateFiltersByQuery = ({
    brandId,
    brandName,
    ...others
  }: {
    [key: string]: string;
  }): Filters => {
    let filters: Filters = {
      brand: brandId || undefined,
    };
    return { ...filters, ...others };
  };

  return (
    <>
      <Head>
        <title>Шины</title>
        <meta name="description" content="Шины"></meta>
        <meta
          name="keywords"
          content="шины, шины для автомобилей, купить шины, колеса"
        />
      </Head>
      <Container>
        <Catalog
          dataFieldsToShow={[
            {
              id: "brand",
              name: "Марка",
            },
            {
              id: "diameter",
              name: "Диаметр",
            },
            {
              id: "width",
              name: "Ширина",
            },
            {
              id: "height",
              name: "Высота",
            },
          ]}
          filtersConfig={filtersConfig}
          title="шины"
          fetchData={fetchTires}
          generateFiltersByQuery={generateFiltersByQuery}
        ></Catalog>
      </Container>
    </>
  );
};

export default Tires;

export async function getStaticProps() {
  return { props: {} };
}
