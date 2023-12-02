import { GetMessages } from "@/lib/database";
import { Params } from "@/lib/route_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    id: string
}


export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const messages = await GetMessages();
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await messages.find( {"Chat": {$eq: ObjectId.createFromHexString(id)}}).toArray();
    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}