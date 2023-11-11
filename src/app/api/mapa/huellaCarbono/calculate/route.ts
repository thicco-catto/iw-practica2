import { getCO2Footprint } from "@/lib/carbonInterface";
import { HasAllKeys } from "@/lib/dict_helper";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

const KEYS: string[] = [
    "adressFrom",
    "adressTo",
    "model"
];


export async function POST(request: NextRequest){
    const json = await request.json();
    console.log ("Hola");
    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json({},
            {
                status: 406
            }
        );
    };
    const adressFrom = json.adressFrom;
    const adressTo = json.adressTo;
    const model = json.model;
    const response = await fetch("http://localhost:3000/api/mapa/distancia?from=" 
    + adressFrom + 
    "&to="+adressTo,{method:'GET'} );
    const distancejson = await response.json()
    const distance = distancejson.distance;


    const result = await getCO2Footprint(parseFloat(distance), model);
    if(!result){
        return NextResponse.json({Error: "Internal Error"},{status: 500});
    }else{
        return NextResponse.json(result,{status: 200});
    }

}