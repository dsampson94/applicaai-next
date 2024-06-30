'use client';

import React from 'react';
import {
    Box,
    ButtonBase,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip
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
                maxWidth: isOpen ? 200 : 60,
                minWidth: isOpen ? 200 : 60,
                transition: 'width 0.3s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRight: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar>
                <IconButton onClick={toggleSidebar} edge="start" color="inherit" aria-label="toggle sidebar">
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>
            <List>
                {menuItems.map(({ text, icon, path }) => (
                    <Tooltip title={!isOpen ? text : ''} key={text} placement="right">
                        <ListItem
                            sx={{
                                backgroundColor: pathname === path ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                            }}
                        >
                            <ButtonBase
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    textAlign: 'left'
                                }}
                                onClick={() => handleNavigation(path)}
                            >
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                {isOpen && <ListItemText primary={text} sx={{ textAlign: 'left' }} />}
                            </ButtonBase>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
