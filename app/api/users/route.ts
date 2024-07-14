import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import { verifyToken } from '../../../lib/server';
import User from '../../../lib/models/User';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        const user = await User.findById(userId);
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const data = await req.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        await User.findByIdAndDelete(userId);
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
