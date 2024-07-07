'use client';

import React, {MouseEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import {getUserFromToken} from "../lib/auth";

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<null | { id: string; email: string; username: string }>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    useEffect(() => {
        const user = getUserFromToken();
        setUser(user);
    }, []);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <AppBar position="sticky"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', color: 'black'}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <div/>
                {user && (
                    <>
                        <IconButton onClick={handleMenuClick} sx={{p: 0}}>
                            <Avatar alt={user.username} src={''}/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
