import { NextRequest, NextResponse } from "next/server";
import { Filter, Document, ObjectId } from "mongodb";
import { GetSubastas } from "@/lib/database";
import { GetIdFilter, Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}

const KEYS: string[] = [
    "Descripcion",
    "Fecha limite",
    "Foto",
    "Precio partida",
    "Titulo",
    "Subastador",
];


export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const subastas = await GetSubastas();

    const res = await subastas.find({
        "Subastador":{$eq:ObjectId.createFromHexString(id)}

    }).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }
    //devuelvo el array entero
    return NextResponse.json(res, {status: 200});
}
