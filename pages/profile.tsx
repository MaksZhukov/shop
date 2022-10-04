import {
  Alert,
  Box,
  Button,
  FormControl,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import InputMask from "react-input-mask";
import { Container } from "@mui/system";
import { observer } from "mobx-react";
import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import { useStore } from "../store";
import styles from "./profile.module.scss";
import Head from "next/head";

const Profile = observer(() => {
  const store = useStore();
  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    store.user.setUsername(e.target.value);
  };
  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    store.user.setPhone(e.target.value);
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    store.user.setAddress(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await store.user.saveUserInfo();
      store.notification.showSuccessMessage("Данные успешно обновлены");
    } catch (err) {
      store.notification.showErrorMessage(
        "Произошла какая-то ошибка с обновлением данных, обратитесь в поддержку"
      );
    }
  };

  return (
    <>
      <Head>
        <title>Профиль</title>
        <meta name="description" content="Профиль пользователя"></meta>
      </Head>
      <Container>
        <Typography textAlign="center" variant="h4" component="h1">
          Профиль
        </Typography>
        <Box
          component="form"
          marginBottom="2em"
          onSubmit={handleSubmit}
          className={styles.content}
        >
          <TextField
            value={store.user.email}
            label="Почта"
            disabled
            variant="standard"
            margin="normal"
            fullWidth
          ></TextField>
          <TextField
            value={store.user.username}
            onChange={handleChangeUsername}
            label="ФИО"
            margin="normal"
            variant="standard"
            fullWidth
          ></TextField>
          <InputMask
            mask="+375 99 999 99 99"
            value={store.user.phone}
            maskChar=" "
            onChange={handleChangePhone}
          >
            {
              //@ts-ignore
              () => (
                <TextField
                  label="Телефон"
                  margin="normal"
                  variant="standard"
                  fullWidth
                ></TextField>
              )
            }
          </InputMask>
          <TextField
            value={store.user.address}
            onChange={handleChangeAddress}
            label="Адрес"
            margin="normal"
            variant="standard"
            fullWidth
          ></TextField>
          <Button fullWidth type="submit">
            Сохранить
          </Button>
        </Box>
      </Container>
    </>
  );
});

export default Profile;
