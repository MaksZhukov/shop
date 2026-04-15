import { Box, SxProps, Typography } from '@mui/material';
import { PhoneCallFilledIcon } from 'shared/icons';
import { WhiteBox } from 'shared/ui';

interface AnyQuestionsLeftProps {
	sx?: SxProps;
}
export const AnyQuestionsLeft: React.FC<AnyQuestionsLeftProps> = ({ sx }) => {
	return (
		<WhiteBox
			sx={[
				{
					alignItems: 'center',
					borderRadius: 4,
					gap: 1,
					p: 1.5,
					py: 2,
					mb: 2,
					bgcolor: { xs: 'custom.bg-surface-1', md: 'white' },
					display: 'flex'
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : [])
			]}>
            <Box
                sx={{
                    bgcolor: 'success.main',
                    width: 40,
                    borderRadius: '50%',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
				<PhoneCallFilledIcon></PhoneCallFilledIcon>
			</Box>
            <Box>
				<Typography
                    variant='body1'
                    sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'text.secondary'
                    }}>
					Остались вопросы?
				</Typography>
				<Typography variant='body1' sx={{
                    color: 'text.primary'
                }}>
					Мы можем с вами связаться
				</Typography>
			</Box>
        </WhiteBox>
    );
};
