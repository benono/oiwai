import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { ForbiddenError, NotFoundError } from "../errors";
import cloudinaryUtil from "../utils/cloudinary.util";
import compressionUtil from "../utils/imageCompression.util";

const prisma = new PrismaClient();

const fetchAlbumPictures = async (eventId: number, limit: number) => {
  const pictures = await prisma.pictures.findMany({
    where: { eventId: eventId },
    select: { id: true, userId: true, imageUrl: true },
    take: limit > 0 ? limit : undefined,
    orderBy: {
      id: "asc",
    },
  });
  return pictures;
};

const addNewPicture = async (
  eventId: number,
  userId: number,
  files: Express.Multer.File[],
) => {
  try {
    const folder = `Album${eventId}`;

    let uploadFiles: Buffer[] = [];
    uploadFiles = await Promise.all(
      files.map(async (file) => {
        return await compressionUtil.compressImage(file.buffer);
      }),
    );

    const uploadPromises = uploadFiles.map((file) =>
      cloudinaryUtil.uploadImage(file, folder),
    );

    const uploadedImages = await Promise.all(uploadPromises);

    return await prisma.$transaction(async (tx) => {
      await tx.pictures.createMany({
        data: uploadedImages.map(({ url, publicId }) => ({
          eventId: eventId,
          userId: userId,
          imageUrl: url,
          imagePublicId: publicId,
        })),
      });

      const createdUrls = await tx.pictures.findMany({
        where: {
          eventId: eventId,
          userId: userId,
          imageUrl: { in: uploadedImages.map(({ url }) => url) },
        },
        select: { imageUrl: true, id: true },
      });

      return createdUrls;
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Failed to upload images and save to DB");
  }
};

const deletePicture = async (
  userId: number,
  isHost: boolean,
  pictureIds: number[],
) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const existingPictures = await tx.pictures.findMany({
        where: { id: { in: pictureIds } },
      });
      if (existingPictures.length !== pictureIds.length) {
        throw new NotFoundError("Picture");
      }

      if (!isHost) {
        const isPoster = existingPictures.every(
          (image) => image.userId === userId,
        );
        if (!isPoster) {
          throw new ForbiddenError(
            "You can not  delete pictures you did not posted.",
          );
        }
      }

      const deletePromises = existingPictures.map((image) =>
        cloudinaryUtil.deleteImage(image.imagePublicId),
      );
      await Promise.all(deletePromises);

      await tx.pictures.deleteMany({
        where: {
          id: {
            in: pictureIds,
          },
        },
      });
    } catch (err) {
      console.error("Transaction failed:", error);
      throw new Error("Failed to delete images and save to DB");
    }
  });
};

const fetchPreviewPictures = async (eventId: number) => {
  const facePicturePreview = await prisma.facePictures.groupBy({
    by: ["tag"],
    where: {
      picture: {
        eventId: eventId,
      },
    },
    _count: {
      _all: true,
    },
    _min: {
      pictureId: true,
    },
  });

  // fetch picture by id
  const previewWithUrls = await Promise.all(
    facePicturePreview.map(async (preview) => {
      const picture = await prisma.pictures.findUnique({
        where: { id: preview._min.pictureId! },
        select: { imageUrl: true },
      });

      return {
        tag: preview.tag,
        previewImageUrl: picture?.imageUrl,
      };
    }),
  );
  return previewWithUrls;
};

const fetchPicturesByTag = async (eventId: number, tag: string) => {
  const pictures = await prisma.facePictures.findMany({
    where: {
      picture: {
        eventId: eventId,
      },
      tag: tag,
    },
    orderBy: {
      id: "asc",
    },
    select: {
      picture: {
        select: {
          imageUrl: true,
        },
      },
    },
  });
  return pictures.map((picture) => picture.picture.imageUrl);
};

export default {
  fetchAlbumPictures,
  addNewPicture,
  deletePicture,
  fetchPreviewPictures,
  fetchPicturesByTag,
};
