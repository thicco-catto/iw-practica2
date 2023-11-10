import { GetPujas } from "@/lib/database";
import { HasCorrectKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb";
import { GetIdFilter, Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}

const KEYS: string[] = [
    "Fecha de puja",
    "Cantidad",
    "Postor",
    "Subasta"
];

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const pujas = await GetPujas();

    const res = await pujas.find(GetIdFilter(id)).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json(res[0], {status: 200});
}

export async function DELETE(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const pujas = await GetPujas();

    const res = await pujas.deleteOne(GetIdFilter(id));

    const status = res.acknowledged ? 200: 500;

    return NextResponse.json(
        {},
        {
            status: status
        }
    );
}

export async function PUT(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(id.length !== 24) {
        return NextResponse.json({}, {status: 406});
    }

    const json = await request.json();

    const pujas = await GetPujas();

    if(!HasCorrectKeys(json, KEYS)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await pujas.updateOne(
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

