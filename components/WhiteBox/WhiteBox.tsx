import { BoxProps } from '@mui/material';
import { ResponsivePropertyParams } from '@mui/material/styles/cssUtils';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

const WhiteBox = ({
	children,
	display,
	justifyContent,
	className,
	marginX,
	textAlign,
	component,
}: BoxProps) => {
	return (
		//@ts-ignore
		<Box
			className={className}
			marginBottom='1em'
			marginX={marginX}
			padding='1em'
			borderRadius='10px'
			textAlign={textAlign}
			component={component}
			sx={{ backgroundColor: '#fff' }}
			display={display}
			justifyContent={justifyContent}>
			{children}
		</Box>
	);
};

export default WhiteBox;
