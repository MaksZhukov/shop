import { Alert, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { forgotPassword } from "../../../api/user/user";
import { useStore } from "../../../store";

interface Props {
  isLoading: boolean;
  onChangeIsLoading: (val: boolean) => void;
}

const ForgotForm: FC<Props> = ({ isLoading, onChangeIsLoading }) => {
  const [email, setEmail] = useState<string>("");
  const store = useStore();
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChangeIsLoading(true);
    try {
      await forgotPassword(email);
      store.notification.showSuccessMessage("Проверьте свою почту");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        store.notification.showErrorMessage("Неверные данные");
      }
    }
    onChangeIsLoading(false);
  };
  return (
    <form onSubmit={handleClickSubmit}>
      <Typography textAlign="center" variant="h4">
        Восстановление пароля
      </Typography>
      <TextField
        fullWidth
        disabled={isLoading}
        margin="normal"
        name="email"
        onChange={handleChangeEmail}
        value={email}
        required
        placeholder="Почта"
      ></TextField>
      <Button disabled={isLoading} variant="contained" type="submit" fullWidth>
        Восстановить
      </Button>
    </form>
  );
};

export default ForgotForm;
