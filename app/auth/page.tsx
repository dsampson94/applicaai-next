'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthLayout from './layout';
import { Container, Box, TextField, Button, Typography, Grid, Link } from '@mui/material';
import Image from 'next/image';
import aplicaLogo from '../../public/applica-logo.png';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const data = isLogin ? { username, password } : { username, email, password };
            const response = await axios.post(endpoint, data);
            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                router.push('/applications');
            } else {
                setMessage(response.data.message);
            }
        } catch (error: any) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <AuthLayout>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Image src={aplicaLogo} alt="Applica Logo" width={80} height={80} />
                    <Typography component="h1" variant="h5">
                        Applica
                    </Typography>
                    <Typography component="h1" variant="h5">
                        {isLogin ? 'Login' : 'Register'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {!isLogin && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {message && <Typography color="error">{message}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </AuthLayout>
    );
}
