"use server";

import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { BasePictureType, PreviewPictureType } from "@/types/album";
import { AxiosError } from "axios";

// Fetch all pictures
export const getAllPictures = async (
  eventId: string,
  limitNumber?: number
): Promise<BasePictureType[]> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(`events/${eventId}/album`, {
      params: { limit: limitNumber },
    });

    return response.data.data.pictures;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to fetch pictures. Please try again.");
    }
  }
};

// Post pictures
export const addPictures = async (
  eventId: string,
  pictures: File[],
): Promise<{
  success: boolean;
  message: string;
  pictures: BasePictureType["imageUrl"][];
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const formData = new FormData();

    pictures.forEach((file) => {
      formData.append("pictures", file);
    });

    const response = await axiosInstance.post(
      `events/${eventId}/album`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to post pictures. Please try again.");
    }
  }
};

// Delete picture
export const deletePicture = async (
  eventId: string,
  pictureIds: string[],
): Promise<{ success: boolean; message: string }> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const requestBody = {
      pictures: pictureIds.map((id) => ({ id })),
    };
    const response = await axiosInstance.delete(`events/${eventId}/album`, {
      data: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to delete picture. Please try again.");
    }
  }
};

// Get preview picture by tag
export const getPreviewPictureByTag = async (eventId: string): Promise<PreviewPictureType[]> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(`events/${eventId}/album/tags`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to get preview picture. Please try again.");
    }
  }
};

// Get all pictures by tag
export const getAllPicturesByTag = async (
  eventId: string,
  tag: string,
): Promise<{
  success: boolean;
  message: string;
  imageUrls: BasePictureType["imageUrl"][];
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(
      `events/${eventId}/album/${tag}`,
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to all categorized pictures. Please try again.");
    }
  }
};
