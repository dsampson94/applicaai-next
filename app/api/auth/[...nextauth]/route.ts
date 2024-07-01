import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    username: string;
    email: string;
    role: string;
}

const generateToken = (user: UserPayload): string => {
    return jwt.sign(user, process.env.JWT_SECRET as string, {expiresIn: '1h'});
};

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {label: 'Username', type: 'text'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const user = await prisma.user.findUnique({
                    where: {username: credentials.username},
                });

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    const tokenPayload: UserPayload = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    };

                    return {
                        ...tokenPayload,
                        accessToken: generateToken(tokenPayload),
                    };
                }

                return null;
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({session, token}) {
            session.user = {
                id: token.id,
                username: token.username,
                email: token.email,
                role: token.role,
            };
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: undefined,
    },
    secret: process.env.NEXTAUTH_SECRET as string,
};

// @ts-ignore
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
