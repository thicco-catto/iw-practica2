import { HasAllKeys } from "@/lib/dict_helper";
import { NextRequest, NextResponse } from "next/server";
import { GetDistance } from "../../distancia/route";
import { GetDirecciones } from "@/lib/database";
import { GetIdFilter } from "@/lib/route_helper";
import { ObjectId } from "mongodb";

const KEYS: string[] = [
    "adressFrom",
    "adressTo",
    "model"
];


export async function POST(request: NextRequest){
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json({},
            {
                status: 406
            }
        );
    }
    const adressFrom = json.adressFrom;
    const adressTo = json.adressTo;

    if(!ObjectId.isValid(adressFrom) || !ObjectId.isValid(adressTo)) {
        return NextResponse.json(
            {
                msg: "The object ids are not correct."
            },
            {
                status: 406
            }
        );
    }

    const direcciones = await GetDirecciones();

    const from = await direcciones.findOne(GetIdFilter(adressFrom));
    const to = await direcciones.findOne(GetIdFilter(adressTo));

    if(!from || !to) {
        return NextResponse.json(
            {

            },
            {
                status: 404
            }
        );
    }

    const model = json.model;
    const distance = await GetDistance(from, to);

    const getData = async () => {
        try {
          const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
            method: 'POST',
            body: JSON.stringify({
              type: "vehicle",
            distance_unit: "km",
            distance_value: distance,
            vehicle_model_id: model
            }),
            headers: {
              Authorization: "Bearer F3dngTi1y1tDC5LeY2QKaQ",
              'Content-type':'application/json'
            }
          })
          const res = await response.json()
          
          console.log(res)
          return res;
        } catch (error) {
          console.error(error)
          return undefined;
        }
      }
      const result = getData();

       if((result===undefined)){
        return NextResponse.json({Error: "Internal Error"},{status: 500});
    }else{
        return NextResponse.json(result,{status: 200});
    }
}