import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {children}
        </Box>
    );
};

export default AuthLayout;
