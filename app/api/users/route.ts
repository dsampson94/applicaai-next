import {NextRequest} from 'next/server';
import prisma from '../../../lib/prisma';
import {handleResponse, verifyToken} from '../../../lib/server';

const RESOURCE_NAME = 'user';

export async function GET(req: NextRequest) {
    try {
        const {id: userId} = verifyToken(req);
        const user = await prisma.user.findUnique({
            where: {id: userId},
        });
        return handleResponse(RESOURCE_NAME, '', user);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const {id: userId} = verifyToken(req);
        const data = await req.json();

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data,
        });
        return handleResponse(RESOURCE_NAME, '', updatedUser);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {id: userId} = verifyToken(req);

        await prisma.user.delete({
            where: {id: userId}
        });
        return handleResponse(RESOURCE_NAME, '', {});
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}
