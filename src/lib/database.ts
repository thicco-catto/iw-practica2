import { MongoClient, ServerApiVersion } from "mongodb";


const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;
if (uri === undefined) {
    console.log("[ERROR] Need to define MongoDB uri as an environment variable");
} else {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    clientPromise = client.connect();
}

export default async function GetDatabase() {
    return await clientPromise;
}