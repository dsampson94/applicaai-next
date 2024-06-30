import clientPromise from "./mongodb";

async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db();
    return {client, db};
}

export default connectToDatabase;
