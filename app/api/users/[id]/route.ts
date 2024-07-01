// src/app/api/applications/[id]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../../lib/prisma';
import {verifyToken} from "../../../../lib/api/server";

const RESOURCE_NAME = 'applications';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, {params}: Params) {
    const {id: userId} = verifyToken(req);
    const {id} = params;

    try {
        const jobApplication = await prisma.application.findFirst({
            where: {
                id,
                userId,
            },
        });
        return NextResponse.json(jobApplication);
    } catch (error: any) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({error: `Error fetching ${RESOURCE_NAME}`}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: Params) {
    const {id: userId} = verifyToken(req);
    const {id} = params;
    const data = await req.json();

    try {
        const updatedJobApplication = await prisma.application.updateMany({
            where: {
                id,
                userId,
            },
            data,
        });

        const applications = await prisma.application.findMany({
            where: {
                userId,
            },
        });

        return NextResponse.json({message: 'Application updated successfully', applications});
    } catch (error: any) {
        console.error(`Error updating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({error: `Error updating ${RESOURCE_NAME}`}, {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params}: Params) {
    const {id: userId} = verifyToken(req);
    const {id} = params;

    try {
        await prisma.application.deleteMany({
            where: {
                id,
                userId,
            },
        });

        const applications = await prisma.application.findMany({
            where: {
                userId,
            },
        });

        return NextResponse.json({message: 'Application deleted successfully', applications});
    } catch (error: any) {
        console.error(`Error deleting ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({error: `Error deleting ${RESOURCE_NAME}`}, {status: 500});
    }
}
