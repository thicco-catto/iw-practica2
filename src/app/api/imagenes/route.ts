import { GetCloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";


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

    const mime = image.type;
    const encoding = "base64";
    const base64Data = Buffer.from(buffer).toString("base64");
    const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    try {
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(fileUri, {
                    invalidate: true
                })
                    .then((result) => {
                        console.log(result);
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await uploadToCloudinary() as any;

        const imageUrl = result.secure_url;

        return NextResponse.json(
            { success: true, imageUrl: imageUrl },
            { status: 200 }
        );
    } catch (error) {
        console.log("server err", error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}