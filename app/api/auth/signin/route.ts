import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from "../../../../lib/db/connect";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
        }

        return NextResponse.json({ id: user._id, username: user.username, email: user.email }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
