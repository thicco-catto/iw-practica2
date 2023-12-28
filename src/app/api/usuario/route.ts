import { GetUsuarios } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document, ObjectId } from "mongodb";

const KEYS: string[] = [
    "Email",
    "Nombre usuario",
    "Foto",
    "Direccion"
];

export async function GET(request: NextRequest) {
    const usuarios = await GetUsuarios();
    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {$and: []};

    const nombreUsuario = params.get("nombreUsuario");
    if(nombreUsuario) {
        filter.$and?.push({ "Nombre usuario": { $regex: nombreUsuario, $options: "i" } });
    }

    const email = params.get("emailUsuario");
    if(email) {
        filter.$and?.push({ "Email": { $eq: email } });
    }

    //En el caso de que el and este vacio, hay que borrar el and porque sino no funciona
    if(filter.$and?.length === 0) {
        delete filter.$and;
    }

    const res = await usuarios.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}
//Insert
export async function POST(request: NextRequest) {
    const usuarios = await GetUsuarios();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }

    json["Direccion"] = ObjectId.createFromHexString(json["Direccion"]);

    const result = await usuarios.insertOne(json);
    const status = result.acknowledged? 201: 500;
    const id = result.insertedId;

    return NextResponse.json(
        {
            id: id
        },
        {
            status: status
        }
    );
}