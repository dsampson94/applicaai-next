import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
        }

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        return NextResponse.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
