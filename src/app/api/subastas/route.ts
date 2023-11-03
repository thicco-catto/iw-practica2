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

        // Do we only need to send 404 if they specify the id?
        if(res.length === 0) {
            return NextResponse.json(
                {},
                {
                    status: 404
                }
            );
        }
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

export async function DELETE(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");
    
    if(!id) {
        return NextResponse.json(
            {
                message: "You need to specify the id of the element to be deleted."
            },
            {
                status: 400
            }
        );
    }

    const subastas = await GetSubastas();

    const res = await subastas.deleteOne({
        _id: {"$eq": ObjectId.createFromHexString(id)}
    });

    const status = res.acknowledged ? 204: 500;

    return NextResponse.json(
        {},
        {
            status: status
        }
    );
}