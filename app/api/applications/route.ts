// app/api/applications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from "../../../lib/db/connect";

const RESOURCE_NAME = 'applications';

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const { db } = await connectToDatabase();
    try {
        const applications = await db.collection(RESOURCE_NAME).find({ userId }).toArray();
        return NextResponse.json(applications);
    } catch (error: any) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const { db } = await connectToDatabase();
    const data = await req.json();

    const newJobApplication = { ...data, userId };

    try {
        const createdJobApplication = await db.collection(RESOURCE_NAME).insertOne(newJobApplication);
        return NextResponse.json(createdJobApplication, { status: 201 });
    } catch (error: any) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
