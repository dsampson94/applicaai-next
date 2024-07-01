import {NextRequest} from 'next/server';
import prisma from '../../../lib/prisma';
import {handleResponse, verifyToken} from '../../../lib/api/server';

const RESOURCE_NAME = 'application';

export async function GET(req: NextRequest) {
    try {
        const {id: userId} = verifyToken(req);

        const applications = await prisma.application.findMany({
            where: {userId},
        });
        return handleResponse(RESOURCE_NAME, '', applications);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const {id: userId} = verifyToken(req);
        const data = await req.json();

        const createdJobApplication = await prisma.application.create({
            data: {...data, userId},
        });
        return handleResponse(RESOURCE_NAME, '', createdJobApplication);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}