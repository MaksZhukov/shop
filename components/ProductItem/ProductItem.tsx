import {
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
	Button,
	Alert,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useStore } from '../../store';
import { Product } from '../../api/products/types';
import styles from './ProductItem.module.scss';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import getConfig from 'next/config';
import {
	addToFavorites,
	removeFromFavorites,
} from '../../api/favorites/favorites';
import { observer } from 'mobx-react-lite';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
}

const ProductItem = ({ data }: Props) => {
	const store = useStore();
	const router = useRouter();
	const favorite = store.favorites.items.find(
		(item) => item.product?.id === data.id
	);

	let thumbnailUrl = data.image
		? publicRuntimeConfig.backendUrl + data.image[0].formats.thumbnail.url
		: publicRuntimeConfig.backendUrl;

	const handleClickMore = (slug: string) => () => {
		router.push('/products/' + slug);
	};

	const handleClickFavorite = async () => {
		try {
			if (favorite) {
				await removeFromFavorites(favorite.id);
				store.favorites.removeFavorite(favorite.id);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из избранного
						</Alert>
					),
				});
			} else {
				let {
					data: { data: favorite },
				} = await addToFavorites(data.id);
				store.favorites.addFavorite(favorite);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно добавили товар в избранное
						</Alert>
					),
				});
			}
		} catch (err) {}
	};

	console.log(favorite, favorite ? 'Star Icon' + data.name : 'No star');

	return (
		<Card sx={{ marginBottom: '2em' }} className={styles.product}>
			<CardMedia
				onClick={handleClickMore(data.slug)}
				component='img'
				image={thumbnailUrl}
				sx={{ width: 200, cursor: 'pointer' }}
				alt={'Product ' + data.name}
			/>
			<CardContent sx={{ flex: 1 }}>
				<Typography component='div' marginBottom='0.5em' variant='h5'>
					{data.name}
				</Typography>
				<Typography
					variant='body1'
					color='text.secondary'
					marginBottom='1em'>
					{data.description}
				</Typography>
				<Box display='flex' alignItems='center'>
					<Typography flex='1' fontWeight='bold' variant='body1'>
						Цена: {data.price} руб.
					</Typography>
					<Button
						onClick={handleClickMore(data.slug)}
						variant='outlined'>
						Подробнее
					</Button>
					<IconButton onClick={handleClickFavorite}>
						{favorite ? (
							<StarIcon color='primary'></StarIcon>
						) : (
							<StarOutlineIcon color='primary'></StarOutlineIcon>
						)}
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	);
};

export default observer(ProductItem);
