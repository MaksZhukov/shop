import { Box } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { Typography, WhiteBox } from 'shared/ui';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { ShareButton } from 'features/share';
import type { Product } from 'entities/product';

interface Props {
	product: Product;
}

export const ProductInfo = ({ product }: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareText = `Посмотрите на этот товар: ${product.h1}`;

	return (
        <>
            <Box
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                }}>
				<Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        gap: 1
                    }}>
					<Typography variant='body1' color='custom.text-muted'>
						Артикул:
					</Typography>
					<Typography variant='body1' color='text.primary'>
						{product.id}
					</Typography>
				</Box>
				<Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
					<ShareButton title={product.h1} text={shareText} url={shareUrl} withText={!isMobile} />
					<FavoriteButton product={product} title={isMobile ? '' : 'В избранное'} />
				</Box>
			</Box>
			<WhiteBox sx={{ px: { xs: 0, md: 2 }, py: { xs: 0, md: 1.5 }, mb: 1, border: 0 }}>
				{/* Desktop header with article and actions */}
				<Box
                    sx={{
                        mb: 1.5,
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 1
                    }}>
					<Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            gap: 1
                        }}>
						<Typography variant='body1' color='custom.text-muted'>
							Артикул:
						</Typography>
						<Typography variant='body1' color='text.primary'>
							{product.id}
						</Typography>
					</Box>
					<Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
						<ShareButton title={product.h1} text={shareText} url={shareUrl} />
						<FavoriteButton product={product} title='В избранное' />
					</Box>
				</Box>

				<Typography component='h1' variant='h6' sx={{ px: { xs: 1, md: 0 }, fontWeight: 'bold', mb: 1.5 }}>
					{product.h1}
				</Typography>

				<Box
                    sx={{
                        bgcolor: 'custom.bg-surface-1',
                        borderRadius: 3,
                        p: 1.5,
                        mb: { xs: 0, md: 1.5 },
                        display: 'flex',
                        gap: 1,
                        alignItems: 'baseline',
                        width: { xs: '100%', md: 'fit-content' }
                    }}>
					{product.discountPrice ? (
						<>
							<Typography variant='h6' component={'span'} color='text.secondary'>
								{product.discountPrice} руб
							</Typography>
							<Typography
								color='custom.text-muted'
								variant='body1'
								sx={{ textDecoration: 'line-through' }}
							>
								{product.price} руб
							</Typography>
						</>
					) : (
						<Typography variant='h6' component={'span'} color='text.secondary'>
							{product.price} руб
						</Typography>
					)}
				</Box>

				<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '191px' }} />
			</WhiteBox>
        </>
    );
};
