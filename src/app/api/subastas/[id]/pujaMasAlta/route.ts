import { GetPujas } from "@/lib/database";
import { Params } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface RouteParams {
    id: string
}

export async function GET(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if (id.length !== 24){
        return NextResponse.json({}, {status: 406});
    }

    const pujas = await GetPujas();

    if (request.nextUrl.pathname.endsWith("pujaMasAlta")){
        const pujasSubasta = await pujas.find({Subasta: ObjectId.createFromHexString(id)}).toArray();

        console.log(pujasSubasta.length);

        if (pujasSubasta.length === 0){
            return NextResponse.json({}, {status: 404});
        }

        const pujaMasAlta = pujasSubasta.sort((a, b) => b.Cantidad - a.Cantidad)[0];

        return NextResponse.json(pujaMasAlta, {status: 200});
    }
}