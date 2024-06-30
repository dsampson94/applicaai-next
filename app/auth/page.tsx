'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Box, Button, Container, Tab, Tabs, TextField, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
// import logo from '../../images/YCPdraft-.png';
import AuthLayout from './layout';

const Auth = () => {
    const router = useRouter();
    const [tab, setTab] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        if (tab === 0) {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            if (result?.error) setError(result.error);
            else router.push('/applications');
        } else {
            try {
                await axios.post('/api/auth/signup', { username, password, email });
                setTab(0);
            } catch (error: any) {
                setError(error.response?.data?.error || 'An error occurred. Please try again.');
            }
        }
    };

    return (
        <AuthLayout>
            <Container sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 4 }} component="main"
                       maxWidth="xs">
                <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        borderRadius: 1,
                        mb: 2
                    }}>
                        <WarningIcon sx={{ color: '#ff9800', marginRight: 1 }} />
                        <Typography
                            component="div"
                            sx={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'center' }}
                        >
                            ADMIN GUI UNDER CONSTRUCTION
                        </Typography>
                        <WarningIcon sx={{ color: '#ff9800', marginLeft: 1 }} />
                    </Box>
                    {/*<Image src={logo} alt="Logo" width={80} height={80} style={{ marginTop: '16px' }} priority />*/}
                    <Typography component="h1" variant="h5">
                        {tab === 0 ? 'Sign In' : 'Sign Up'}
                    </Typography>
                    <Tabs value={tab} onChange={handleTabChange} centered>
                        <Tab label="Sign In" />
                        <Tab label="Sign Up" />
                    </Tabs>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="dense"
                            size="small"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete={tab === 0 ? 'username' : 'new-username'}
                            autoFocus
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        />
                        {tab === 1 && (
                            <TextField
                                margin="dense"
                                size="small"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="new-email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        )}
                        <TextField
                            margin="dense"
                            size="small"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete={tab === 0 ? 'current-password' : 'new-password'}
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {tab === 0 ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </AuthLayout>
    );
};

export default Auth;
