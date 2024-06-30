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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ListAltIcon from '@mui/icons-material/ListAlt';
import KitchenIcon from '@mui/icons-material/Kitchen';
import {ENDPOINTS} from "../lib/constants";

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
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Users', icon: <PeopleIcon />, path: `/${ENDPOINTS.users.slice(0, -1)}` },
        { text: 'Orders', icon: <ShoppingCartIcon />, path: `/${ENDPOINTS.orders.slice(0, -1)}` },
        { text: 'Menus', icon: <RestaurantMenuIcon />, path: `/${ENDPOINTS.menus.slice(0, -1)}` },
        { text: 'Recipes', icon: <ListAltIcon />, path: `/${ENDPOINTS.recipes.slice(0, -1)}` },
        { text: 'Ingredients', icon: <KitchenIcon />, path: `/${ENDPOINTS.ingredients.slice(0, -1)}` },
        { text: 'Suppliers', icon: <LocalGroceryStoreIcon />, path: `/${ENDPOINTS.suppliers.slice(0, -1)}` },
        { text: 'Locations', icon: <LocationOnIcon />, path: `/${ENDPOINTS.locations.slice(0, -1)}` },
        // { text: 'Reviews', icon: <RateReviewIcon />, path: `/${ENDPOINTS.reviews.slice(0, -1)}` }
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
