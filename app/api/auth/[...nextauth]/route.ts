import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/db/mongodb";
import connectToDatabase from "../../../../lib/db/connect";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const { db } = await connectToDatabase();

                const user = await db.collection('users').findOne({ username: credentials.username as string });
                if (user && await bcrypt.compare(credentials.password as string, user.password)) {
                    return { id: user._id.toString(), username: user.username, email: user.email };
                }
                return null;
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                username: token.username,
                email: token.email,
            };
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
    secret: process.env.NEXTAUTH_SECRET,
};

// @ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
