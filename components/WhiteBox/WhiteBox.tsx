import { BoxProps } from '@mui/material';
import { ResponsivePropertyParams } from '@mui/material/styles/cssUtils';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

const WhiteBox = ({ children, display, justifyContent, className }: BoxProps) => {
    return (
        //@ts-ignore
        <Box
            className={className}
            marginBottom="1em"
            padding="1em"
            borderRadius="10px"
            sx={{ backgroundColor: '#fff' }}
            display={display}
            justifyContent={justifyContent}>
            {children}
        </Box>
    );
};

export default WhiteBox;
