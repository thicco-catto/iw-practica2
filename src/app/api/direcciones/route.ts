import { GetDirecciones } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { Filter, Document } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const KEYS: string[] = [
    "Calle",
    "Codigo postal",
    "Localidad",
    "Provincia",
    "Numero",
    "Pais",
];

export async function GET(request: NextRequest) {
    const direcciones = await GetDirecciones();

    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {};

    const codigoPostal = params.get("codigoPostal");
    if(codigoPostal){
        filter["Codigo postal"] = codigoPostal;
    }

    const numero = params.get("numero");
    if(numero){
        const parsedNumero = parseInt(numero);
        if(Number.isNaN(parsedNumero)){
            return NextResponse.json({}, {status: 406});
        }

        filter["Numero"] = parsedNumero;
    }

    const provincia = params.get("provincia");
    if(provincia){
        filter["Provincia"] = provincia;
    }

    const res = await direcciones.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status : 200
        }
    );
}

// Insert
export async function POST(request: NextRequest){
    const direcciones = await GetDirecciones();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)){
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }

    const result = await direcciones.insertOne(json);
    const status = result.acknowledged? 201: 500;
    const id = result.insertedId;

    return NextResponse.json(
        {
            id: id
        },
        {
            status: status
        }
    );
}