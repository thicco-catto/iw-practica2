import { NextRequest, NextResponse } from "next/server";
import { GetCloudinary } from "@/lib/cloudinary";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const cloudinary = await GetCloudinary();
    const publicId = params.id;

    const result = await cloudinary.api.resource(publicId);

    return NextResponse.json(result, {status: 200});
}