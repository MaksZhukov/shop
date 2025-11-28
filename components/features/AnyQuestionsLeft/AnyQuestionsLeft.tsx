import { Box, SxProps, Typography } from '@mui/material';
import { PhoneCallFilledIcon } from 'components/icons';
import { WhiteBox } from 'components/ui';

interface AnyQuestionsLeftProps {
	sx?: SxProps;
}
export const AnyQuestionsLeft: React.FC<AnyQuestionsLeftProps> = ({ sx }) => {
	return (
		<WhiteBox
			alignItems='center'
			borderRadius={4}
			gap={1}
			p={1.5}
			py={2}
			mb={2}
			bgcolor={{ xs: 'custom.bg-surface-1', md: 'white' }}
			display='flex'
			sx={sx}
		>
			<Box
				bgcolor={'success.main'}
				width={40}
				borderRadius={'50%'}
				height={40}
				display='flex'
				alignItems='center'
				justifyContent='center'
				color='white'
			>
				<PhoneCallFilledIcon></PhoneCallFilledIcon>
			</Box>
			<Box>
				<Typography variant='body1' fontSize={'16px'} fontWeight={500} color='text.secondary'>
					Остались вопросы?
				</Typography>
				<Typography variant='body1' color='text.primary'>
					Мы можем с вами связаться
				</Typography>
			</Box>
		</WhiteBox>
	);
};
