import { PrismaClient } from "@prisma/client";
import Review from "../types/review";

const prisma = new PrismaClient();

const fetchReviewTexts = async (eventId: number) => {
  const reviewTexts = await prisma.reviews.findMany({
    where: { eventId: eventId },
    select: {
      id: true,
      reviewText: true,
      userId: true,
      user: {
        select: {
          name: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
  return reviewTexts;
};

const fetchReviewImages = async (eventId: number) => {
  const reviewTexts = await prisma.reviews.findMany({
    where: { eventId: eventId },
    select: {
      imageUrl1: true,
      imageUrl2: true,
      imageUrl3: true,
      imageUrl4: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  return reviewTexts;
};

const createReview = async (
  eventId: number,
  userId: number,
  reviewText: string,
  creates: Omit<Review, "id" | "userId" | "eventId" | "reviewText">,
) => {
  const filteredCreates = Object.fromEntries(
    Object.entries(creates).filter(([_, v]) => v !== undefined),
  );

  if (Object.keys(filteredCreates).length === 0) {
    throw new Error("no valid update fields");
  }
  const newReview = await prisma.reviews.create({
    data: {
      eventId: eventId,
      userId: userId,
      reviewText: reviewText,
      ...creates,
    },
  });
  return newReview;
};

export default {
  fetchReviewTexts,
  fetchReviewImages,
  createReview,
};
