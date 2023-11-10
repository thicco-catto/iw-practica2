import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});
  
// Log the configuration
console.log(cloudinary.config());

export async function GetCloudinary() {
    return cloudinary;
}

export async function uploadStream(buffer : ReadableStream) {
    return new Promise((res, rej) => {
      const theTransformStream = cloudinary.uploader.upload_stream(
        {},
        (err, result) => {
          if (err) return rej(err);
          res(result);
        }
      );
      const str = new Readable();
      str.wrap(buffer as unknown as NodeJS.ReadableStream);
      str.pipe(theTransformStream);
    });
}