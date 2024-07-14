import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import { verifyToken } from '../../../lib/server';
import Application from '../../../lib/models/Application';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);

    try {
        const applications = await Application.find({ userId });
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const data = await req.json();

    try {
        const newApplication = new Application({ ...data, userId });
        await newApplication.save();
        return NextResponse.json(newApplication);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
