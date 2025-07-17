import { BoxProps, Box, useTheme } from '@mui/material';

type WhiteBoxProps = BoxProps & { withShadow?: boolean };

const WhiteBox = ({ children, withShadow, ...props }: WhiteBoxProps) => {
	const theme = useTheme();
	return (
		<Box
			borderRadius={4}
			border={`1px solid ${theme.palette.custom.divider}`}
			boxShadow={withShadow ? '0px 10px 25px 0px #1018281F' : undefined}
			bgcolor={'background.paper'}
			{...props}
		>
			{children}
		</Box>
	);
};

export default WhiteBox;
