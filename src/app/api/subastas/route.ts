import { GetSubastas } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb";

const KEYS: string[] = [
    "Descripcion",
    "Fecha limite",
    "Foto",
    "Precio partida",
    "Titulo",
    "Subastador",
];

export async function GET(request: NextRequest) {
    const subastas = await GetSubastas();
    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {$and: []};

    const minPrice = params.get("minPrice");
    if(minPrice) {
        const parsedMinPrice = parseInt(minPrice);
        if(Number.isNaN(parsedMinPrice)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Precio partida": {$gte: parsedMinPrice}});
    }

    const estado = params.get("estado");
    if(estado) {
        filter.$and?.push({"Estado": { $regex: estado, $options: "i" }});
    }
    
    
    const maxPrice = params.get("maxPrice");
    if(maxPrice) {
        const parsedMaxPrice = parseInt(maxPrice);
        if(Number.isNaN(parsedMaxPrice)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Precio partida": {$lte: parsedMaxPrice}});
    }

    const titulo = params.get("titulo");
    if(titulo) {
        filter.$and?.push({ "Titulo": { $regex: titulo, $options: "i" } });
    }


    //En el caso de que el and este vacio, hay que borrar el and porque sino no funciona
    if (filter.$and?.length === 0) {
        delete filter.$and;
    }
    const res = await subastas.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}

export async function POST(request: NextRequest) {
    const subastas = await GetSubastas();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {
                msg: "Fields are not correct"
            },
            {
                status: 406
            }
        );
    }

    json["Fecha limite"] = new Date(json["Fecha limite"]);
    json["Estado"] = "en subasta";
    
    const result = await subastas.insertOne(json);

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