// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from "../../../../lib/db/connect";

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Username, email, and password are required.' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, email, password: hashedPassword });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
