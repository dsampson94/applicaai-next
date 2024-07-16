import { NextRequest, NextResponse } from 'next/server';
import mailgun from 'mailgun.js';
import formData from 'form-data';

const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const API_KEY = process.env.MAILGUN_API_KEY as string;

const mg = new mailgun(formData);
const client = mg.client({ username: 'api', key: API_KEY });

interface EmailData {
    to: string;
    subject: string;
    text: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { to, subject, text }: EmailData = await req.json();

    const data = {
        from: 'ApplicaAI <no-reply@applicaai.com>',
        to,
        subject,
        text,
    };

    try {
        await client.messages.create(DOMAIN, data);
        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
