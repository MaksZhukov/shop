import { Box, Typography, useTheme } from '@mui/material';
import { Button, WhiteBox } from 'shared/ui';
import { AnyQuestionsLeft } from 'shared/ui';

interface CartSummaryProps {
	selectedItemsCount: number;
	totalAmount: number;
	onCheckout: () => void;
}

export const CartSummary = ({ selectedItemsCount, totalAmount, onCheckout }: CartSummaryProps) => {
	const theme = useTheme();

	return (
		<Box display='flex' maxWidth={{ xs: '100%', md: '400px' }} gap={1} flexDirection='column'>
			<WhiteBox>
				<Box p={2} borderBottom={`1px solid ${theme.palette.custom.divider}`}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						fullWidth
						disabled={totalAmount === 0}
						onClick={onCheckout}
					>
						Перейти к оформлению
					</Button>
					<Typography mt={0.5} textAlign='center' variant='body1' color='custom.text-muted'>
						Доступные способы и условия доставки можно узнать при оформлении заказа
					</Typography>
				</Box>
				<Box p={1.5}>
					<Box display='flex' gap={1} mb={0.5}>
						<Typography flex={1} variant='body1' color='custom.text-muted'>
							Всего:
						</Typography>
						<Typography variant='body1' color='custom.text-muted'>
							{selectedItemsCount} шт.
						</Typography>
					</Box>
					<Box display='flex' gap={1}>
						<Typography flex={1} variant='h6' fontWeight={500} fontSize='16px'>
							Сумма заказа:
						</Typography>
						<Typography variant='h6'>{totalAmount} руб.</Typography>
					</Box>
				</Box>
			</WhiteBox>
			<AnyQuestionsLeft sx={{ display: { xs: 'none', md: 'flex' } }} />
		</Box>
	);
};
