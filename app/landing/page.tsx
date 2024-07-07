'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthLayout from './layout';
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
            <div className="bg-white p-8 rounded shadow-xl max-w-sm w-full">
                <div className="flex flex-col items-center mb-6">
                    <Image src={aplicaLogo} alt="Applica Logo" width={80} height={80} />
                    <h1 className="text-3xl font-bold mt-4">Applica</h1>
                    <h2 className="text-xl mt-2">{isLogin ? 'Login' : 'Register'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {message && <p className="text-red-500 text-sm">{message}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>
                    <div className="text-center">
                        <a href="#" onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:text-indigo-500">
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                        </a>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
