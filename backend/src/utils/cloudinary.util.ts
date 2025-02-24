import { v2 as cloudinary } from "cloudinary";

const uploadImage = (fileBuffer: Buffer, folder: string): Promise<string> => {
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
