import { Box, Divider, Typography, useTheme } from '@mui/material';
import { Button, WhiteBox } from 'shared/ui';
import { AnyQuestionsLeft } from 'shared/ui';

interface OrderSummaryProps {
	selectedItemsCount: number;
	totalAmount: number;
	onCheckout: () => void;
	buttonText?: string;
	disclaimerText: string | React.ReactNode;
	disabled?: boolean;
}

export const OrderSummary = ({
	selectedItemsCount,
	totalAmount,
	onCheckout,
	buttonText,
	disclaimerText,
	disabled
}: OrderSummaryProps) => {
	const theme = useTheme();

	return (
        <Box
            sx={{
                display: 'flex',
                maxWidth: { xs: '100%', md: '400px' },
                gap: 1,
                flexDirection: 'column'
            }}>
			<WhiteBox sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}>
				<Box sx={{
                    p: 2
                }}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						fullWidth
						disabled={totalAmount === 0 || disabled}
						onClick={onCheckout}
					>
						{buttonText || 'Перейти к оформлению'}
					</Button>
					<Typography
                        variant='body1'
                        sx={{
                            mt: 0.5,
                            textAlign: 'center',
                            color: 'custom.text-muted'
                        }}>
						{disclaimerText}
					</Typography>
				</Box>
				<Divider />
				<Box sx={{
                    p: 1.5
                }}>
					<Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            mb: 0.5
                        }}>
						<Typography
                            variant='body1'
                            sx={{
                                flex: 1,
                                color: 'custom.text-muted'
                            }}>
							Всего:
						</Typography>
						<Typography variant='body1' sx={{
                            color: 'custom.text-muted'
                        }}>
							{selectedItemsCount} шт.
						</Typography>
					</Box>
					<Box
                        sx={{
                            display: 'flex',
                            gap: 1
                        }}>
						<Typography
                            variant='h6'
                            sx={{
                                flex: 1,
                                fontWeight: 500,
                                fontSize: '16px'
                            }}>
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
