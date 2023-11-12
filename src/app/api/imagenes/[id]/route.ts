import { NextRequest, NextResponse } from "next/server";
import { GetCloudinary } from "@/lib/cloudinary";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}

export async function GET(_: NextRequest, { params }: Params<RouteParams>) {
    const cloudinary = GetCloudinary();
    const publicId = params.id;

    try {
        const result = await cloudinary.api.resource(publicId);

        return NextResponse.json({ public_id: result.public_id, url: result.url }, { status: 200 });
    } catch (_) {
        return NextResponse.json({}, { status: 404 });
    }
}

export async function DELETE(_: NextRequest, { params }: Params<RouteParams>) {
    const cloudinary = GetCloudinary();
    const publicID = params.id;

    try {
        const result = await cloudinary.uploader.destroy(publicID);

        return NextResponse.json(result, { status: 200 });
    } catch (_) {
        return NextResponse.json({}, { status: 404 });
    }
}