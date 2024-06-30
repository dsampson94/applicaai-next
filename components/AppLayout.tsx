'use client';

import React, { ReactNode, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import ClientProvider from './ClientProvider';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ClientProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <CssBaseline />
                <Header onMenuClick={toggleSidebar} />
                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </ClientProvider>
    );
};

export default AppLayout;
