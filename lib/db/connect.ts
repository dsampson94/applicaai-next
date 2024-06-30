import clientPromise from "./mongodb";

const dbName = process.env.MONGODB_DB;

if (!dbName) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
}

async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { client, db };
}

export default connectToDatabase;
