import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { AllReviewsType, ReviewImagesType } from "@/types/review";
import { AxiosError } from "axios";

// Fetch all reviews
export const getAllReviews = async (
  eventId: string,
): Promise<AllReviewsType> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(`events/${eventId}/reviews`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to fetch reviews. Please try again.");
    }
  }
};


// Fetch review images
export const getReviewImages = async (
  eventId: string,
): Promise<ReviewImagesType> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(`events/${eventId}/review-images`);

    return response.data.data.reviewImages;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to fetch review images. Please try again.");
    }
  }
};
