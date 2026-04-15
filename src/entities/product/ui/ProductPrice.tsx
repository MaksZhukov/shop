import { Box, SxProps, Typography } from '@mui/material';
import { Product } from 'entities/product';

interface Props {
	data: Product;
	withPercentage?: boolean;
	sx?: SxProps;
}

export const ProductPrice = ({ data, withPercentage = true, sx }: Props) => {
	return (
        <Box
            sx={[{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
            }, ...(Array.isArray(sx) ? sx : [sx])]}>
            {data.discountPrice ? (
				<>
					<Typography
                        variant='h6'
                        component={'span'}
                        sx={{
                            fontSize: '20px',
                            color: 'text.secondary'
                        }}>
						{data.discountPrice} руб
					</Typography>
					<Typography
                        sx={{
                            color: 'custom.text-muted',
                            textDecoration: 'line-through'
                        }}>
						{data.price} руб
					</Typography>
					{withPercentage && (
						<Typography sx={{
                            color: 'text.secondary'
                        }}>
							{(((data.discountPrice - data.price) / data.discountPrice) * 100).toFixed()}%
						</Typography>
					)}
				</>
			) : (
				<Typography
                    variant='h6'
                    component={'span'}
                    sx={{
                        fontSize: '20px',
                        color: 'text.secondary'
                    }}>
					{data.price} руб
				</Typography>
			)}
        </Box>
    );
};
