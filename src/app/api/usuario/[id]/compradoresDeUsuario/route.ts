import { GetPujas, GetSubastas, GetUsuarios } from "@/lib/database";
import { Params } from "@/lib/route_helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    id: string
}

export async function GET(request: NextRequest, {params}: Params<RouteParams>){
    const id = params.id;

    if (!ObjectId.isValid(id)){
        return NextResponse.json({}, {status: 406});
    }

    const usuarios = await GetUsuarios();
    const subastas = await GetSubastas();
    const pujas = await GetPujas();

    if(request.nextUrl.pathname.endsWith("compradoresDeUsuario")){
        const subastasUsuario = await subastas.find({Subastador: ObjectId.createFromHexString(id)}).toArray();

        const compradoresFinales = [];
        for(const subasta of subastasUsuario){
            const pujaMasAlta = await pujas.find({Subasta: subasta._id}).sort({Cantidad: -1}).limit(1).toArray();

            if (pujaMasAlta.length > 0){
                const compradorFinal = await usuarios.findOne({_id: pujaMasAlta[0].Postor});
                compradoresFinales.push(compradorFinal);
            }
        }
        return NextResponse.json(compradoresFinales, {status: 200});
    }
}