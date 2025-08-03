import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { CloseIcon } from 'components/icons/CloseIcon';
import WhiteBox from 'components/ui/WhiteBox';
import { FC } from 'react';

interface ModalContainerProps {
	onClose: () => void;
	title: string | React.ReactNode;
	width?: string;
	children: React.ReactNode;
	py?: number;
	px?: number;
	sx?: SxProps;
	height?: string;
}

export const ModalContainer: FC<ModalContainerProps> = ({ onClose, title, width, children, py = 1, px = 2, sx }) => {
	return (
		<WhiteBox color='text.primary' withShadow width={width} px={px} py={py} sx={sx}>
			<Box gap={1} display={'flex'} alignItems={'center'} mb={1} justifyContent={'space-between'}>
				<Typography flex={1} variant='body1' fontWeight={'500'} fontSize={'16px'}>
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
