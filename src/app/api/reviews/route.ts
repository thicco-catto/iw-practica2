import { GetReviews } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb";

const KEYS: string[] = [
    "comprador",
    "vededor",
    "puntuacion"
];

export async function GET() {
    const reviews = await GetReviews();

    const filter: Filter<Document> = {$and: []};

    

    //En el caso de que el and este vacio, hay que borrar el and porque sino no funciona
    if(filter.$and?.length === 0) {
        delete filter.$and;
    }

    const res = await reviews.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}
//Insert
export async function POST(request: NextRequest) {
    const reviews = await GetReviews();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }

    const result = await reviews.insertOne(json);
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