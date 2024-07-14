import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import { verifyToken } from '../../../lib/server';
import Application from '../../../lib/models/Application';
import { sendEmail } from '../../../lib/mailgun';

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
        const application = await Application.create({ ...data, userId });

        await sendEmail({
            to: data.contactEmail,
            subject: 'New Job Application Created',
            text: `A job application for the role of ${data.role} at ${data.company} has been created.`,
        });

        return NextResponse.json(application);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
