import { GetVehiclesMakes } from "@/lib/carbonInterface";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest, response: NextResponse){
 const vehicles = await GetVehiclesMakes();
if (vehicles){
     return NextResponse.json( vehicles,{status: 200}
    );
} else {
    return NextResponse.json({},{status:500});
}
}