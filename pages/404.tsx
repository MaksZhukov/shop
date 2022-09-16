import { Container, Typography } from "@mui/material";
import WhiteBox from "components/WhiteBox";

const PageNotFound = () => {
  return (
    <Container>
      <WhiteBox>
        <Typography component="h1" variant="h4" textAlign="center">
          Страница не найдена
        </Typography>
      </WhiteBox>
    </Container>
  );
};

export default PageNotFound;
