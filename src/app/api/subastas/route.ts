import GetDatabase from "@/lib/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");

    const db = await GetDatabase();
    const subastas = db.collection("Subastas");
    let res;

    if(id !== null) {
        res = await subastas.find({
            _id: {$eq: ObjectId.createFromHexString(id)}
        }).toArray();
    } else {
        res = await subastas.find().limit(20).toArray();
    }

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}