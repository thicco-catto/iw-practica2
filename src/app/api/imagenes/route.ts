import { GetCloudinary } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import streamifier from "streamifier";


export async function POST(request: NextRequest) {
    let formData;

    try {
        formData = await request.formData();
    } catch (_) {
        return NextResponse.json({ msg: "Body must be form data" }, { status: 406 });
    }

    const file = formData.get("file");

    if (!file) {
        return NextResponse.json({ msg: "Field file is missing" }, { status: 400 });
    }

    const image = file as File;
    let raw;
    try {
        raw = await image.arrayBuffer();
    } catch (_) {
        return NextResponse.json({ msg: "Error converting file to array buffer" }, { status: 400 });
    }
    const buffer = Buffer.from(raw);

    const cloudinary = GetCloudinary();

    const streamUpload = () => {
        return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    };

    let result;
    try {
        result = await streamUpload();
    } catch (_) {
        return NextResponse.json({ msg: "Error in promise uploading image to cloudinary" }, { status: 400 });
    }

    if (!result) {
        return NextResponse.json({ msg: "Error when uploading image to cloudinary" }, { status: 400 });
    }

    return NextResponse.json({ public_id: result.public_id, url: result.url }, { status: 200 });
}