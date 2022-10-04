import { Alert, IconButton } from "@mui/material";
import { useStore } from "store";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { observer } from "mobx-react";
import { Product } from "api/types";

interface Props {
  product: Product;
}

const ShoppingCartButton = ({ product }: Props) => {
  const store = useStore();
  const cartItem = store.cart.items.find(
    (item) => item.product.id === product.id
  );

  const handleClick = async () => {
    try {
      if (cartItem) {
        try {
          await store.cart.removeCartItem(cartItem);
          store.notification.showSuccessMessage(
            "Вы успешно удалили товар из корзины"
          );
        } catch (err) {
          store.notification.showErrorMessage(
            "Произошла какая-то ошибка при удалении из корзины, обратитесь в поддержку"
          );
        }
      } else {
        try {
          await store.cart.addCartItem({
            id: new Date().getTime(),
            uid: new Date().getTime().toString(),
            product,
          });
          store.notification.showSuccessMessage(
            "Вы успешно добавили товар в корзину"
          );
        } catch (err) {
          store.notification.showErrorMessage(
            "Произошла какая-то ошибка при добавлении в корзину, обратитесь в поддержку"
          );
        }
      }
    } catch (err) {}
  };
  return (
    <IconButton onClick={handleClick}>
      {cartItem ? (
        <ShoppingCartIcon color="primary"></ShoppingCartIcon>
      ) : (
        <ShoppingCartOutlinedIcon color="primary"></ShoppingCartOutlinedIcon>
      )}
    </IconButton>
  );
};

export default observer(ShoppingCartButton);
