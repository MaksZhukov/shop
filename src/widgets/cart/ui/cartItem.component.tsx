import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { Link, WhiteBox } from 'shared/ui';
import type { Cart } from 'entities/cart';
import { ProductItemImages, ProductPrice } from 'entities/product';
import { FavoriteButton } from 'features/favorites';
import { TrashIcon } from 'shared/icons';
import { getProductLink, getProductDetails, CART_ITEM_IMAGE_WIDTH, CART_ITEM_IMAGE_HEIGHT } from 'entities/product';
import { Button } from 'shared/ui';

interface CartItemProps {
	item: Cart;
	isSelected: boolean;
	onToggleSelect: (itemId: number) => void;
	onRemove: (item: Cart) => void;
	onClickBuy: (item: Cart) => void;
}

export const CartItem = ({ item, isSelected, onToggleSelect, onRemove, onClickBuy }: CartItemProps) => {
	const product = item.product;
	const productDetails = getProductDetails(product);

	const productUrl = getProductLink(product);

	const handleClickBuy = (item: Cart) => () => {
		onClickBuy(item);
	};

	const renderBuyButton = (
		<Button
			disabled={item.product.sold}
			onClick={handleClickBuy(item)}
			variant={item.product.sold ? 'contained' : 'outlined'}
			size='small'
		>
			{item.product.sold ? 'Товар закончился' : 'Купить'}
		</Button>
	);

	const renderActionButtons = (showBuyButton: boolean) => {
		return (
			<>
				{!item.product.sold && <FavoriteButton product={product} />}
				<IconButton size='large' onClick={() => onRemove(item)}>
					<TrashIcon />
				</IconButton>
				{showBuyButton && renderBuyButton}
			</>
		);
	};

	return (
		<WhiteBox sx={{ mb: 1, p: { xs: 1, md: 2 } }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    position: 'relative'
                }}>
				<Box
                    sx={{
                        overflow: 'hidden',
                        borderRadius: 2,
                        width: CART_ITEM_IMAGE_WIDTH,
                        height: CART_ITEM_IMAGE_HEIGHT
                    }}>
					<Box
                        sx={{
                            position: 'absolute',
                            bgcolor: 'white',
                            zIndex: 1,
                            left: 0,
                            top: 0
                        }}>
						<Checkbox sx={{ padding: 0 }} checked={isSelected} onChange={() => onToggleSelect(item.id)} />
					</Box>
					<ProductItemImages
						disabled={item.product.sold}
						data={product}
						width={CART_ITEM_IMAGE_WIDTH}
						imageHeight={CART_ITEM_IMAGE_HEIGHT}
						imageHeightOffset={0}
					/>
				</Box>
				<Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
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
							<Typography
                                sx={{
                                    mb: 1,
                                    color: 'custom.text-muted'
                                }}>
								{productDetails}
							</Typography>
						)}
					</Box>
					<Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center'
                        }}>
						{renderActionButtons(true)}
					</Box>
				</Box>
				<ProductPrice
					data={product}
					withPercentage={false}
					sx={{ display: { xs: 'none', md: 'flex' }, opacity: item.product.sold ? 0.5 : 1 }}
				/>
			</Box>
            <Box
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
				{renderBuyButton}
				<Box>{renderActionButtons(false)}</Box>
			</Box>
        </WhiteBox>
    );
};
