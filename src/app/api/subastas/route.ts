import GetDatabase from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function GetSubastas() {
    const db = await GetDatabase();
    return db.collection("Subastas");
}

const KEYS: string[] = [
    "Descripcion",
    "Fecha limite",
    "Foto",
    "Precio partida",
    "Titulo",
    "Subastador",
];

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");

    const subastas = await GetSubastas();
    let res;

    if(id !== null) {
        res = await subastas.find({
            _id: {$eq: ObjectId.createFromHexString(id)}
        }).toArray();
    } else {
        res = await subastas.find().limit(20).toArray();
    }

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}

export async function POST(request: NextRequest) {
    const subastas = await GetSubastas();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {},
            {
                status: 400
            }
        );
    }

    
    const result = await subastas.insertOne(json);

    const status = result.acknowledged? 200: 500;
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