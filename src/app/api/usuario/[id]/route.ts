import { GetUsuarios } from "@/lib/database";
import { HasCorrectKeys } from "@/lib/dict_helper";
import { GetIdFilter, Params } from "@/lib/route_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    id: string
}

const KEYS: string[] = [
    "Email",
    "Nombre usuario",
    "Foto",
];

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const usuarios = await GetUsuarios();

    const res = await usuarios.findOne(GetIdFilter(id));

    if(!res) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json(res, {status: 200});
}

export async function PUT(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const json = await request.json();

    const usuario = await GetUsuarios();

    if(!HasCorrectKeys(json, KEYS)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await usuario.updateOne(
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
//Delete
export async function DELETE(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const usuario = await GetUsuarios();

    const res = await usuario.deleteOne(GetIdFilter(id));

    const status = res.acknowledged ? 200: 500;

    return NextResponse.json(
        {},
        {
            status: status
        }
    );
}