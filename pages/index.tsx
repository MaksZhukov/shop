import type { NextPage } from "next";
import { fetchSpareParts } from "api/spareParts/spareParts";
import Catalog from "components/Catalog";
import { Container } from "@mui/material";

const Home: NextPage = () => {
  return (
    <Container>
      <Catalog
        dataFieldsToShow={[
          {
            id: "brand",
            name: "Марка",
          },
          {
            id: "model",
            name: "Модель",
          },
          {
            id: "kindSparePart",
            name: "Запчасть",
          },
        ]}
        title="запчасти"
        fetchData={fetchSpareParts}
      ></Catalog>
    </Container>
  );
};

export default Home;
