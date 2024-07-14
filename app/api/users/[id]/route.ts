import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../lib/models/User';
import { verifyToken } from '../../../../lib/server';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: any) {
        console.error(`Error fetching user: ${error.message}`);
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;
    const data = await req.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error: any) {
        console.error(`Error updating user: ${error.message}`);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}
