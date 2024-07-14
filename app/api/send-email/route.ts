import { NextRequest, NextResponse } from 'next/server';
import mailgun from 'mailgun-js';

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY as string, domain: DOMAIN as string });

export async function POST(req: NextRequest) {
    const { to, subject, text } = await req.json();

    const data = {
        from: 'ApplicaAI <no-reply@applicaai.com>',
        to,
        subject,
        text,
    };

    try {
        await mg.messages().send(data);
        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
