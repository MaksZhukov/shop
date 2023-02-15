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
            padding={padding || '1em'}
            borderRadius={borderRadius}
            textAlign={textAlign}
            component={component}
            sx={{ backgroundColor: '#fff' }}
            display={display}
            width={width}
            minHeight={minHeight}
            maxWidth={maxWidth}
            justifyContent={justifyContent}>
            {children}
        </Box>
    );
};

export default WhiteBox;
