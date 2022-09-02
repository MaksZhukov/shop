import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Filters from "components/Filters";
import WhiteBox from "components/WhiteBox";
import styles from "./awaiting-auto.module.scss";

const AwaitingAuto = () => {
  return (
    <Container>
      <WhiteBox>
        <Typography component="h1" variant="h4" textAlign="center">
          Ожидаемые авто
        </Typography>
      </WhiteBox>
      <Box className={styles.sider}>
        <Filters></Filters>
      </Box>
      <Box></Box>
    </Container>
  );
};

export default AwaitingAuto;
