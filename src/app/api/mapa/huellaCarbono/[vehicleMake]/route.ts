import { GetVehiclesModels } from "@/lib/carbonInterface";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: unknown, {params}: Params){
    const vehicleMake = params.vehicleMake;
    const vehicles = await GetVehiclesModels(vehicleMake);
   if (vehicles){
        return NextResponse.json( vehicles,{status: 200}
       );
   } else {
       return NextResponse.json({},{status:500});
   }
   }