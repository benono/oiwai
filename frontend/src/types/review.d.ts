import { BaseUserType } from "./user";

export type CreateReviewType = {
  reviewText: string;
  images: File[];
};

export type CreateReviewResponseType = {
  id: string;
  reviewText: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  imageUrl4: string;
};

export type ReviewType = {
  id: number;
  reviewText: string;
  userId: number;
  user: Omit<BaseUserType, "id">;
};

export type AllReviewsType = {
  data: {
    reviews: ReviewType[];
  },
  hasPostedReview: boolean;
};

export type ReviewImagesType = string[];
