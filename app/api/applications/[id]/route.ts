import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '../../../../lib/mongoose';
import Application from '../../../../lib/models/Application';
import { verifyToken } from '../../../../lib/server';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    try {
        const application = await Application.findOne({ _id: id, userId });
        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const applications = await Application.find({ userId });
        return NextResponse.json(applications.map(app => app.toObject()));
    } catch (error: any) {
        console.error(`Error fetching application: ${error.message}`);
        return NextResponse.json({ error: 'Error fetching application' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;
    const data = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    try {
        const updatedApplication = await Application.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true }
        );

        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const applications = await Application.find({ userId });

        return NextResponse.json(applications.map(app => app.toObject()));
    } catch (error: any) {
        console.error(`Error updating application: ${error.message}`);
        return NextResponse.json({ error: 'Error updating application' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    const { id: userId } = verifyToken(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    try {
        const deletedApplication = await Application.findOneAndDelete({ _id: id, userId });
        if (!deletedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const applications = await Application.find({ userId });
        return NextResponse.json(applications.map(app => app.toObject()));
    } catch (error: any) {
        console.error(`Error deleting application: ${error.message}`);
        return NextResponse.json({ error: 'Error deleting application' }, { status: 500 });
    }
}
