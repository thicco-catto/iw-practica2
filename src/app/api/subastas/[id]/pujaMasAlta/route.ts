import { GetPujas } from "@/lib/database";
import { Params } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface RouteParams {
    id: string
}

export async function GET(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if (!ObjectId.isValid(id)){
        return NextResponse.json({}, {status: 406});
    }

    const pujas = await GetPujas();

    if (request.nextUrl.pathname.endsWith("pujaMasAlta")){
        const pujasSubasta = await pujas.find({Subasta: ObjectId.createFromHexString(id)})
            .sort({Cantidad: -1})
            .limit(1)
            .toArray();

        if (pujasSubasta.length === 0){
            return NextResponse.json({}, {status: 404});
        }

        const pujaMasAlta = pujasSubasta[0];

        return NextResponse.json(pujaMasAlta, {status: 200});
    }
}