import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../lib/prisma';

export async function PUT(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const data = await req.json();

    try {
        const updatedProfile = await prisma.userProfile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
        });
        return NextResponse.json(updatedProfile);
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Error updating user profile' }, { status: 500 });
    }
}
