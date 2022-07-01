import {
	Alert,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import InputMask from 'react-input-mask';
import {
	ChangeEvent,
	FormEvent,
	ReactElement,
	ReactNode,
	useState,
} from 'react';
import { useStore } from 'store';
import { createOrder } from 'api/orders/orders';
import { observer } from 'mobx-react-lite';
import { removeAllItemsFromShoppingCart } from 'api/cart/cart';

const CheckoutForm = () => {
	const store = useStore();
	const [username, setUsername] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [isUseUsernameProfile, setIsUseUsernameProfile] =
		useState<boolean>(false);
	const [isUseAddressProfile, setIsUseAddressProfile] =
		useState<boolean>(false);
	const [isUsePhoneProfile, setIsUsePhoneProfile] = useState<boolean>(false);

	const handleChangeUsernameCheckbox = () => {
		let newValue = !isUseUsernameProfile;
		setIsUseUsernameProfile(!isUseUsernameProfile);
		if (newValue) {
			setUsername(store.user.username);
		}
	};
	const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value);
	};

	const handleChangeAddressCheckbox = () => {
		let newValue = !isUseAddressProfile;
		setIsUseAddressProfile(!isUseAddressProfile);
		if (newValue) {
			setAddress(store.user.address);
		}
	};

	const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
		setPhone(e.target.value);
	};

	const handleChangePhoneCheckbox = () => {
		let newValue = !isUsePhoneProfile;
		setIsUsePhoneProfile(!isUsePhoneProfile);
		if (newValue) {
			setPhone(store.user.phone);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await Promise.all([
				createOrder({
					address,
					email: store.user.email,
					phone,
					username,
					products: store.cart.items.map((item) => item.product.id),
				}),
				removeAllItemsFromShoppingCart(),
			]);
			store.notification.showMessage({
				content: (
					<Alert variant='filled'>Ваш заказ принят в обработку</Alert>
				),
			});
			store.cart.clearShoppingCart();
		} catch (err) {}
	};

	return (
		<Box padding='1em'>
			<Typography marginBottom='1em' textAlign='center' variant='h5'>
				Форма заказа
			</Typography>
			<form onSubmit={handleSubmit}>
				<FormControl fullWidth>
					<TextField
						required
						InputProps={{
							readOnly: isUseUsernameProfile,
						}}
						value={
							isUseUsernameProfile
								? store.user.username
								: username
						}
						variant='standard'
						onChange={handleChangeUsername}
						label='ФИО'></TextField>{' '}
					<FormControlLabel
						label='Использовать из профиля'
						control={
							<Checkbox
								onChange={handleChangeUsernameCheckbox}
								checked={isUseUsernameProfile}></Checkbox>
						}></FormControlLabel>
				</FormControl>
				<FormControl fullWidth>
					<TextField
						required
						InputProps={{
							readOnly: isUseAddressProfile,
						}}
						value={
							isUseAddressProfile ? store.user.address : address
						}
						variant='standard'
						onChange={handleChangeAddress}
						label='Адрес доставки'></TextField>{' '}
					{store.user.address && (
						<FormControlLabel
							label='Использовать из профиля'
							control={
								<Checkbox
									onChange={handleChangeAddressCheckbox}
									checked={isUseAddressProfile}></Checkbox>
							}></FormControlLabel>
					)}
				</FormControl>
				<FormControl fullWidth>
					<InputMask
						mask='+375 99 999 99 99'
						value={isUsePhoneProfile ? store.user.phone : phone}
						maskChar=' '
						required
						onChange={handleChangePhone}>
						{
							//@ts-ignore
							() => (
								<TextField
									required
									InputProps={{
										readOnly: isUsePhoneProfile,
									}}
									variant='standard'
									onChange={handleChangePhone}
									label='Телефон'></TextField>
							)
						}
					</InputMask>
					{store.user.phone && (
						<FormControlLabel
							label='Использовать из профиля'
							control={
								<Checkbox
									onChange={handleChangePhoneCheckbox}
									checked={isUsePhoneProfile}></Checkbox>
							}></FormControlLabel>
					)}
				</FormControl>
				<Box marginTop='1em' display='flex' justifyContent='center'>
					<Button type='submit' variant='contained'>
						Заказать
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default observer(CheckoutForm);
