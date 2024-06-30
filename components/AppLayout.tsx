'use client';

import React, {ReactNode, useState} from 'react';
import {Box, CssBaseline} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import ClientProvider from './ClientProvider';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ClientProvider>
            <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
                <CssBaseline/>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                    <Header/>
                    <Box component="main" sx={{flexGrow: 1, p: 3, overflowY: 'auto'}}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </ClientProvider>
    );
};

export default AppLayout;
