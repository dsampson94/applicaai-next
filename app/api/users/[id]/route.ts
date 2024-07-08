import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/server';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    const { id: userId } = verifyToken(req);
    const { id } = params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return NextResponse.json(user);
    } catch (error: any) {
        console.error(`Error fetching user: ${error.message}`);
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { id: userId } = verifyToken(req);
    const { id } = params;
    const data = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data
        });

        return NextResponse.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error: any) {
        console.error(`Error updating user: ${error.message}`);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}
