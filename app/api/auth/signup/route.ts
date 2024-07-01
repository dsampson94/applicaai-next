import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const {username, email, password} = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({message: 'Username, email, and password are required.'}, {status: 400});
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: username},
                    {email: email}
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json({message: 'User already exists'}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profiles: {
                    create: {
                        name: username,
                        cvs: {
                            create: [],
                        },
                    },
                },
            },
        });

        return NextResponse.json({user}, {status: 201});
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}
