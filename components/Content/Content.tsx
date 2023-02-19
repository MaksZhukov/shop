import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
    children: ReactNode;
}

const Content = ({ children }: Props) => {
    return (
        <Box flex="1" paddingTop={{ xs: '3.5em', md: '4em' }}>
            {children}
        </Box>
    );
};

export default Content;
