import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const profile = await prisma.userProfile.findUnique({
            where: { userId: id },
        });
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        return NextResponse.json(profile);
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 });
    }
}
