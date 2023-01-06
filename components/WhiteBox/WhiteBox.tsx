import { BoxProps } from '@mui/material';
import { Box } from '@mui/system';

const WhiteBox = ({
	children,
	display,
	justifyContent,
	className,
	marginX,
	textAlign,
	padding,
	maxWidth,
	width,
	component,
}: BoxProps) => {
	return (
		//@ts-ignore
		<Box
			className={className}
			marginBottom='1em'
			marginX={marginX}
			padding={padding || '1em'}
			borderRadius='10px'
			textAlign={textAlign}
			component={component}
			sx={{ backgroundColor: '#fff' }}
			display={display}
			width={width}
			maxWidth={maxWidth}
			justifyContent={justifyContent}
		>
			{children}
		</Box>
	);
};

export default WhiteBox;
