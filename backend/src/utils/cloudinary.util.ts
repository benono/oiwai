import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (fileBuffer: Buffer, folder: string): Promise<string> => {
  console.log("upload func");
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(new Error("faild to upload image"));
        } else {
          resolve(result.secure_url);
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export default {
  uploadImage,
};
