import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { CloseIcon } from 'shared/icons/CloseIcon';
import { WhiteBox } from 'shared/ui/WhiteBox';
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
		<WhiteBox
			withShadow
			sx={[
				{ color: 'text.primary', width, px, py },
				...(Array.isArray(sx) ? sx : sx ? [sx] : [])
			]}>
            <Box
                sx={{
                    gap: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 1,
                    justifyContent: 'space-between'
                }}>
				{typeof title === 'string' ? (
					<Typography
                        variant='body1'
                        sx={{
                            flex: 1,
                            fontWeight: '500',
                            fontSize: '16px'
                        }}>
						{title}
					</Typography>
				) : (
					<Box
                        sx={{
                            flex: 1,
                            minWidth: 0
                        }}>{title}</Box>
				)}
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
