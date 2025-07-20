import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { CloseIcon } from 'components/Icons/CloseIcon';
import WhiteBox from 'components/WhiteBox';
import { FC } from 'react';

interface ModalContainerProps {
	onClose: () => void;
	title: string;
	width: string;
	children: React.ReactNode;
	py?: number;
	px?: number;
	sx?: SxProps;
}

export const ModalContainer: FC<ModalContainerProps> = ({ onClose, title, width, children, py = 1, px = 2, sx }) => {
	return (
		<WhiteBox color='text.primary' withShadow width={width} px={px} py={py} sx={sx}>
			<Box display={'flex'} alignItems={'center'} mb={1} justifyContent={'space-between'}>
				<Typography variant='body1' fontWeight={'500'} fontSize={'16px'}>
					{title}
				</Typography>
				<IconButton
					onClick={onClose}
					size='medium'
					sx={{
						borderRadius: 2,
						backgroundColor: 'custom.bg-surface-4'
					}}
				>
					<CloseIcon />
				</IconButton>
			</Box>
			{children}
		</WhiteBox>
	);
};
