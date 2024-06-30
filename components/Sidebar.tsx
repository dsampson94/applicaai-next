'use client';

import React from 'react';
import {
    Box,
    ButtonBase,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const menuItems = [
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
        { text: 'Applications', icon: <DashboardIcon />, path: '/applications' },
    ];

    return (
        <Box
            sx={{
                minWidth: isOpen ? 240 : 70,
                transition: 'width 0.3s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: '#1e293b',
                color: 'white',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: isOpen ? 'space-between' : 'center',
                    alignItems: 'center',
                    padding: isOpen ? '0 16px' : '0 8px',
                }}
            >
                <IconButton onClick={toggleSidebar} edge="start" color="inherit" aria-label="toggle sidebar">
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                {isOpen && <Typography variant="h5" sx={{ mr: 5, fontWeight: 'bold' }}>ApplicaAi</Typography>}
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
                {menuItems.map(({ text, icon, path }) => (
                    <Tooltip title={!isOpen ? text : ''} key={text} placement="right">
                        <ListItem
                            sx={{
                                backgroundColor: pathname === path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                padding: '10px 16px',
                                margin: '4px 0',
                                borderRadius: '8px'
                            }}
                        >
                            <ButtonBase
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    textAlign: 'left',
                                    color: pathname === path ? '#EF4444' : 'white',
                                }}
                                onClick={() => handleNavigation(path)}
                            >
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {icon}
                                </ListItemIcon>
                                {isOpen && (
                                    <Typography sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1rem' }}>
                                        {text}
                                    </Typography>
                                )}
                            </ButtonBase>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
