import { GetCloudinary } from "@/lib/cloudinary";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

function createMissingFolders(destination: string) {
    const destFolder = path.dirname(destination);

    if (!existsSync(destFolder)) {
        mkdirSync(destFolder, { recursive: true });
    }
}

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
    const raw = await image.arrayBuffer();
    const buffer = Buffer.from(raw);

    const filePath = path.join(process.cwd(), "public", "temp", image.name);
    createMissingFolders(filePath);
    writeFileSync(filePath, buffer);

    const cloudinary = GetCloudinary();
    const result = await cloudinary.uploader.upload(filePath);

    rmSync(filePath);

    return NextResponse.json({ public_id: result.public_id, url: result.url }, { status: 200 });
}