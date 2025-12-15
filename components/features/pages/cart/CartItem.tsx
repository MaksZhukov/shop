import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { Link, WhiteBox } from 'shared/ui';
import { ShoppingCart } from 'api/shopping-cart/types';
import { ProductItemImages } from 'components/features/ProductItemImages';
import { ProductPrice } from 'components/features/ProductPrice';
import FavoriteButton from 'components/features/FavoriteButton';
import { TrashIcon } from 'shared/icons';
import { isSparePart } from 'services/ProductService';
import { Button } from 'shared/ui';
import { Product } from 'api/types';

interface CartItemProps {
	item: ShoppingCart;
	isSelected: boolean;
	onToggleSelect: (itemId: number) => void;
	onRemove: (item: ShoppingCart) => void;
}

const IMAGE_WIDTH = 136;
const IMAGE_HEIGHT = 108;

export const CartItem = ({ item, isSelected, onToggleSelect, onRemove }: CartItemProps) => {
	const product = item.product;
	const productDetails = !isSparePart(product)
		? ''
		: [product.volume?.name, product.fuel, product.transmission, product.year].filter(Boolean).join(', ');
	const productUrl = `/spare-parts/${product.brand?.slug}/${product.id}`;

	const renderActionButtons = (showBuyButton: boolean) => {
		return (
			<>
				{!item.product.sold && <FavoriteButton product={product} />}
				<IconButton size='large' onClick={() => onRemove(item)}>
					<TrashIcon />
				</IconButton>
				{showBuyButton && (
					<Button
						disabled={item.product.sold}
						sx={{ ml: 1 }}
						variant={item.product.sold ? 'contained' : 'outlined'}
						size='small'
					>
						{item.product.sold ? 'Товар закончился' : 'Купить'}
					</Button>
				)}
			</>
		);
	};

	return (
		<WhiteBox mb={1} p={{ xs: 1, md: 2 }}>
			<Box display='flex' gap={1} position='relative'>
				<Box overflow='hidden' borderRadius={2} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
					<Box position='absolute' bgcolor='white' zIndex={1} left={0} top={0}>
						<Checkbox sx={{ padding: 0 }} checked={isSelected} onChange={() => onToggleSelect(item.id)} />
					</Box>
					<ProductItemImages
						disabled={item.product.sold}
						data={product}
						width={IMAGE_WIDTH}
						imageHeight={IMAGE_HEIGHT}
						imageHeightOffset={0}
					/>
				</Box>
				<Box flex={1} display='flex' flexDirection='column' justifyContent='space-between'>
					<Box>
						<ProductPrice
							data={product}
							withPercentage={false}
							sx={{ display: { xs: 'flex', md: 'none' }, mb: 0, opacity: item.product.sold ? 0.5 : 1 }}
						/>
						<Link href={productUrl} lineClamp={2} disabled={item.product.sold}>
							{product.h1}
						</Link>
						{productDetails && (
							<Typography mb={1} color='custom.text-muted'>
								{productDetails}
							</Typography>
						)}
					</Box>
					<Box display={{ xs: 'none', md: 'flex' }} alignItems='center'>
						{renderActionButtons(true)}
					</Box>
				</Box>
				<ProductPrice
					data={product}
					withPercentage={false}
					sx={{ display: { xs: 'none', md: 'flex' }, opacity: item.product.sold ? 0.5 : 1 }}
				/>
			</Box>
			<Box display={{ xs: 'flex', md: 'none' }} justifyContent='space-between' alignItems='center'>
				<Button
					disabled={item.product.sold}
					variant={item.product.sold ? 'contained' : 'outlined'}
					size='small'
				>
					{item.product.sold ? 'Товар закончился' : 'Купить'}
				</Button>
				<Box>{renderActionButtons(false)}</Box>
			</Box>
		</WhiteBox>
	);
};
