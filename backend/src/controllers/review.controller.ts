import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError, ValidationError } from "../errors";
import reviewModel from "../models/review.model";
import usersModel from "../models/user.model";
import cloudinaryUtil from "../utils/cloudinary.util";

const getReviewTexts = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const { userId } = getAuth(req);
    if (!userId) {
      throw new UnauthorizedError();
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      throw new NotFoundError("User");
    }

    const reviews = await reviewModel.fetchReviewTexts(eventId);

    const hasPostedReview = reviews.some((review) => review.userId === user.id);

    res.status(200).json({ data: { reviews }, hasPostedReview });
  } catch (err) {
    next(err);
  }
};

const getReviewImages = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const reslut = await reviewModel.fetchReviewImages(eventId);
    const reviewImages = reslut
      .flatMap((obj) => Object.values(obj))
      .filter((url) => url !== "");

    res.status(200).json({ data: { reviewImages } });
  } catch (err) {
    next(err);
  }
};

const createReview = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const { userId } = getAuth(req);
    if (!userId) {
      throw new UnauthorizedError();
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      throw new NotFoundError("User");
    }

    const folder = `Album${eventId}`;
    const files = req.files;

    const imageValues = {
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      imageUrl4: "",
      imagePublicId1: "",
      imagePublicId2: "",
      imagePublicId3: "",
      imagePublicId4: "",
    };

    if (files) {
      const uploadedFiles = files as Express.Multer.File[];
      const uploadPromises = uploadedFiles.map((file) =>
        cloudinaryUtil.uploadImage(file.buffer, folder),
      );
      const uploadedImages = await Promise.all(uploadPromises);

      imageValues.imageUrl1 = uploadedImages[0] ? uploadedImages[0].url : "";
      imageValues.imageUrl2 = uploadedImages[1] ? uploadedImages[1].url : "";
      imageValues.imageUrl3 = uploadedImages[2] ? uploadedImages[2].url : "";
      imageValues.imageUrl4 = uploadedImages[3] ? uploadedImages[3].url : "";
      imageValues.imagePublicId1 = uploadedImages[0]
        ? uploadedImages[0].publicId
        : "";
      imageValues.imagePublicId2 = uploadedImages[1]
        ? uploadedImages[1].publicId
        : "";
      imageValues.imagePublicId3 = uploadedImages[2]
        ? uploadedImages[2].publicId
        : "";
      imageValues.imagePublicId4 = uploadedImages[3]
        ? uploadedImages[3].publicId
        : "";
    }

    const reviewText: string = req.body.reviewText || "";

    const result = await reviewModel.createReview(
      eventId,
      user.id,
      reviewText,
      imageValues,
    );

    const reviews = {
      id: result.id,
      reviewText: result.reviewText,
      imageUrl1: result.imageUrl1,
      imageUrl2: result.imageUrl2,
      imageUrl3: result.imageUrl3,
      imageUrl4: result.imageUrl4,
    };
    res.status(200).json({
      success: true,
      message: "posted a review successfully!",
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getReviewTexts,
  getReviewImages,
  createReview,
};
