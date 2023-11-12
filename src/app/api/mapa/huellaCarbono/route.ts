import { GetVehiclesMakes } from "@/lib/carbonInterface";
import { NextResponse } from "next/server";

export async function GET() {
    const vehicles = await GetVehiclesMakes();
    if (vehicles) {
        return NextResponse.json(vehicles, { status: 200 }
        );
    } else {
        return NextResponse.json({}, { status: 500 });
    }
}