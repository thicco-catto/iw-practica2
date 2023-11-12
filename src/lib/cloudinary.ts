import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

if(!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
    error("[ERROR] Need to define Cloudinary related environment variables (Name, key and secret)");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

export function GetCloudinary() {
    return cloudinary;
}