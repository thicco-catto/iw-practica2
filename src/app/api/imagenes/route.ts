import { uploadStream } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    const img = request.body;

    if (!img){
        return NextResponse.json({}, {status: 406});
    }

    const result = await uploadStream(img); 

    return NextResponse.json(result, {status: 200});
}