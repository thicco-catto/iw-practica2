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

/**
 * Returns a database instance.
 * 
 * @param name Don't specify a name to get the Rastro database.
 * @returns
 */
export async function GetDatabase(name = "Rastro") {
    return (await clientPromise).db(name);
}

export async function GetSubastas() {
    const db = await GetDatabase();
    return db.collection("Subastas");
}
export async function GetUsuarios() {
    const db = await GetDatabase();
    return db.collection("Usuarios");
}
export async function GetPujas() {
    const db = await GetDatabase();
    return db.collection("Pujas");
}

export async function GetDirecciones() {
    const db = await GetDatabase();
    return db.collection("Direcciones");
}