import { BoxProps, Box } from '@mui/material';

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
	component = 'div',
	borderRadius,
	minHeight,
	marginBottom,
	boxShadow
}: BoxProps) => {
	return (
		//@ts-ignore
		<Box
			boxShadow={boxShadow}
			className={className}
			marginBottom={marginBottom}
			marginX={marginX}
			component={component}
			padding={padding || '1em'}
			borderRadius={borderRadius}
			textAlign={textAlign}
			sx={{ backgroundColor: '#fff' }}
			display={display}
			width={width}
			minHeight={minHeight}
			maxWidth={maxWidth}
			justifyContent={justifyContent}
		>
			{children}
		</Box>
	);
};

export default WhiteBox;
