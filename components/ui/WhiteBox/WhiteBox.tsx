import { BoxProps, Box, useTheme } from '@mui/material';
import { FC } from 'react';

type WhiteBoxProps = BoxProps & { withShadow?: boolean };

export const WhiteBox: FC<WhiteBoxProps> = ({ children, withShadow, ...props }) => {
	const theme = useTheme();
	return (
		<Box
			borderRadius={4}
			border={`1px solid ${theme.palette.custom.divider}`}
			boxShadow={withShadow ? `0px 10px 25px 0px ${theme.palette.custom.shadow}` : undefined}
			bgcolor={'background.paper'}
			{...props}
		>
			{children}
		</Box>
	);
};
