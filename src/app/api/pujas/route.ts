import { GetPujas } from "@/lib/database";
import { HasCorrectKeys } from "@/lib/dict_helper";
import { GetIdFilter, Params } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";
import { HasAllKeys } from "@/lib/dict_helper";
import { Filter } from "mongodb";

interface RouteParams {
    id: string
}

const KEYS: string[] = [
    "Fecha de puja",
    "Cantidad",
    "Postor",
    "Subasta"
];

export async function GET(request: NextRequest) {
    const pujas = await GetPujas();

    //Filter
    const params = request.nextUrl.searchParams;
    const filter: Filter<Document> = {};
    const fecha = params.get("fecha");
    const postor = params.get("fecha");
    const minPrice = params.get("minPrice");

    if(fecha){
        filter["Fecha de puja"] = {$eq: fecha};
    }

    if(postor){
        filter["Postor"] = {$eq: postor};
    }

    if(minPrice) {
        const parsedMinPrice = parseInt(minPrice);
        if(Number.isNaN(parsedMinPrice)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Precio partida": {$gte: parsedMinPrice}});
    }

    const res = await pujas.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status : 200
        }
    );
}

// Insert
export async function POST(request: NextRequest){
    const pujas = await GetPujas();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)){
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }

    const result = await pujas.insertOne(json);
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