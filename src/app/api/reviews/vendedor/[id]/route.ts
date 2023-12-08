import { GetReviews } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}


export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const reviews = await GetReviews();

    const res = await reviews.find({
        "vendedor":{$eq:ObjectId.createFromHexString(id)}

    }).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }
    //devuelvo el array entero
    return NextResponse.json(res, {status: 200});
}

