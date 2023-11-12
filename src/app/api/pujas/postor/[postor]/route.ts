import { GetPujas } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    postor: string
}

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.postor;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const pujas = await GetPujas();

    const res = await pujas.find({Postor: {$eq : ObjectId.createFromHexString(id)}}).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json(res, {status: 200});
}