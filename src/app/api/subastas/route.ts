import { GetSubastas } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb";

const KEYS: string[] = [
    "Descripcion",
    "Fecha limite",
    "Foto",
    "Precio partida",
    "Titulo",
    "Subastador",
];

export async function GET(request: NextRequest) {
    const subastas = await GetSubastas();
    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {$and: []};

    const minPrice = params.get("minPrice");
    if(minPrice) {
        const parsedMinPrice = parseInt(minPrice);
        if(Number.isNaN(parsedMinPrice)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Precio partida": {$gte: parsedMinPrice}});
    }

    const maxPrice = params.get("maxPrice");
    if(maxPrice) {
        const parsedMaxPrice = parseInt(maxPrice);
        if(Number.isNaN(parsedMaxPrice)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Precio partida": {$lte: parsedMaxPrice}});
    }

    const res = await subastas.find(filter).toArray();

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