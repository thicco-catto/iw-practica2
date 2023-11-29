import { GetMessages } from "@/lib/database";
import { GetIdFilter, Params } from "@/lib/route_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export interface RouteParams{
    id: string;
}

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const chats = await GetMessages();
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await chats.findOne(GetIdFilter(id));
    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}


export async function DELETE(_: NextRequest, {params}: Params<RouteParams>) {
    const messages = await GetMessages();
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await messages.deleteOne(GetIdFilter(id));
    const status = res.acknowledged ? 200: 500;
    return NextResponse.json({}
        ,{
            status: status
        }
    );
}



