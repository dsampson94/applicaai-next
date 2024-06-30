'use client';

import React, {MouseEvent, useState} from 'react';
import {signOut, useSession} from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const Header = () => {
    const {data: session} = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        signOut({callbackUrl: '/'});
    };

    return (
        <AppBar position="sticky"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', color: 'black'}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <div/>
                {session && (
                    <>
                        <IconButton onClick={handleMenuClick} sx={{p: 0}}>
                            <Avatar alt={session.user?.username || ''} src={''}/>
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
