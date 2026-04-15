import { Box, BoxProps } from '@mui/material';
import { FC } from 'react';

type WhiteBoxProps = BoxProps & { withShadow?: boolean };

export const WhiteBox: FC<WhiteBoxProps> = ({ children, withShadow, sx, ...props }) => (
	<Box
		{...props}
		sx={[
			{
				borderRadius: 4,
				border: '1px solid',
				borderColor: 'custom.divider',
				boxShadow: withShadow ? '0px 10px 25px 0px #1018281F' : undefined,
				bgcolor: 'background.paper'
			},
			...(Array.isArray(sx) ? sx : sx ? [sx] : [])
		]}>
		{children}
	</Box>
);
