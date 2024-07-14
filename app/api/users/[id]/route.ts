import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../lib/models/User';
import { verifyToken } from '../../../../lib/server';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: any) {
        console.error(`Error fetching user: ${error.message}`);
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const data = await req.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error: any) {
        console.error(`Error updating user: ${error.message}`);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}
