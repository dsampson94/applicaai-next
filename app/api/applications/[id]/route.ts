// app/api/applications/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {ObjectId} from "bson";
import connectToDatabase from "../../../../lib/db/connect";

const RESOURCE_NAME = 'applications';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const { db } = await connectToDatabase();
    const { id } = params;

    try {
        const jobApplication = await db.collection(RESOURCE_NAME).findOne({ _id: new ObjectId(id), userId });
        return NextResponse.json(jobApplication);
    } catch (error: any) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const { db } = await connectToDatabase();
    const { id } = params;
    const data = await req.json();

    try {
        const updatedJobApplication = await db.collection(RESOURCE_NAME).findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set: data },
            { returnDocument: 'after' }
        );
        return NextResponse.json(updatedJobApplication.value);
    } catch (error: any) {
        console.error(`Error updating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error updating ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id;
    const { db } = await connectToDatabase();
    const { id } = params;

    try {
        await db.collection(RESOURCE_NAME).deleteOne({ _id: new ObjectId(id), userId });
        return NextResponse.json({ message: `${RESOURCE_NAME.slice(0, -1)} deleted` });
    } catch (error: any) {
        console.error(`Error deleting ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error deleting ${RESOURCE_NAME}` }, { status: 500 });
    }
}
