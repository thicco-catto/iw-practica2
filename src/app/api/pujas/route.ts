import { GetPujas } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { HasAllKeys } from "@/lib/dict_helper";
import { Filter, Document } from "mongodb";

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
    const filter: Filter<Document> = {$and: []};
    const cantidad = params.get("Cantidad");
    const fecha = params.get("Fecha");

    if(fecha){
        const fechaBuena = new Date(fecha);
        filter.$and?.push({"Fecha de puja": {$lt: fechaBuena}});
    }

    if(cantidad) {
        const parsedCantidad = parseInt(cantidad);
        if(Number.isNaN(parsedCantidad)) {
            return NextResponse.json({}, {status: 406});
        }
        filter.$and?.push({"Cantidad": {$gte: parsedCantidad}});
    }

    //En el caso de que el and este vacio, hay que borrar el and porque sino no funciona
    if(filter.$and?.length === 0) {
        delete filter.$and;
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