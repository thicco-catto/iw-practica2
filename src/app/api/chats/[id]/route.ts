import { GetChats } from "@/lib/database";
import { GetIdFilter, Params } from "@/lib/route_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    id: string
}




export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const chats = await GetChats();
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
    const chats = await GetChats();
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await chats.deleteOne(GetIdFilter(id));
    const status = res.acknowledged ? 200: 500;
    return NextResponse.json({}
        ,{
            status: status
        }
    );
}



