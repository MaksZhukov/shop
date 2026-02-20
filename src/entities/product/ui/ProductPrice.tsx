import { Box, SxProps, Typography } from '@mui/material';
import { Product } from 'entities/product';

interface Props {
	data: Product;
	withPercentage?: boolean;
	sx?: SxProps;
}

export const ProductPrice = ({ data, withPercentage = true, sx }: Props) => {
	return (
		<Box display='flex' alignItems='center' gap={1} mb={1} sx={sx}>
			{data.discountPrice ? (
				<>
					<Typography variant='h6' component={'span'} fontSize='20px' color='text.secondary'>
						{data.discountPrice} руб
					</Typography>
					<Typography color='custom.text-muted' sx={{ textDecoration: 'line-through' }}>
						{data.price} руб
					</Typography>
					{withPercentage && (
						<Typography color='text.secondary'>
							{(((data.discountPrice - data.price) / data.discountPrice) * 100).toFixed()}%
						</Typography>
					)}
				</>
			) : (
				<Typography variant='h6' component={'span'} fontSize='20px' color='text.secondary'>
					{data.price} руб
				</Typography>
			)}
		</Box>
	);
};
