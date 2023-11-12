import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { GetSubastas } from "@/lib/database";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
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
