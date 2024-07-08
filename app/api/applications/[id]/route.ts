import {NextRequest} from 'next/server';
import prisma from '../../../../lib/prisma';
import {handleResponse, verifyToken} from '../../../../lib/server';

const RESOURCE_NAME = 'application';

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
        return handleResponse(RESOURCE_NAME, '', jobApplication);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}

export async function PUT(req: NextRequest, {params}: Params) {
    const {id: userId} = verifyToken(req);
    const {id} = params;
    const data = await req.json();

    try {
        await prisma.application.updateMany({
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
        return handleResponse(RESOURCE_NAME, '', applications);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
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
        return handleResponse(RESOURCE_NAME, '', applications);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}