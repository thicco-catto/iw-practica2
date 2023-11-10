import { GetDirecciones } from "@/lib/database";
import { HasCorrectKeys } from "@/lib/dict_helper";
import { GetIdFilter, Params } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    id: string
}

const KEYS: string[] = [
    "Calle",
    "Codigo postal",
    "Localidad",
    "Provincia",
    "Numero",
    "Pais",
];

export async function GET(_: NextRequest, {params}: Params<RouteParams>){
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const direcciones = await GetDirecciones();

    const res = await direcciones.find(GetIdFilter(id)).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json(res[0], {status: 200});
}

export async function PUT(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const json = await request.json();

    const direcciones = await GetDirecciones();

    if(!HasCorrectKeys(json, KEYS)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await direcciones.updateOne(
        GetIdFilter(id),
        {
            $set: json
        }
    );

    if(res.matchedCount === 0) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json({}, {status: 200});
}

export async function DELETE(_: NextRequest, {params}: Params<RouteParams>){
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const direcciones = await GetDirecciones();

    const res = await direcciones.deleteOne(GetIdFilter(id));

    const status = res.acknowledged ? 200: 500;

    return NextResponse.json(
        {},
        {
            status: status
        }
    );
}