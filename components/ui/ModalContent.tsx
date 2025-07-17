import { Box, IconButton, Typography } from '@mui/material';
import { CloseIcon } from 'components/Icons/CloseIcon';
import WhiteBox from 'components/WhiteBox';
import { FC } from 'react';

interface ModalContentProps {
	onClose: () => void;
	title: string;
	width: string;
	children: React.ReactNode;
}

export const ModalContent: FC<ModalContentProps> = ({ onClose, title, width, children }) => {
	return (
		<WhiteBox color='text.primary' withShadow width={width} px={2} py={1}>
			<Box display={'flex'} alignItems={'center'} mb={1} justifyContent={'space-between'}>
				<Typography variant='body1' fontWeight={'500'} fontSize={'16px'}>
					{title}
				</Typography>
				<IconButton sx={{ borderRadius: 2 }} size={'medium'} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			{children}
		</WhiteBox>
	);
};
