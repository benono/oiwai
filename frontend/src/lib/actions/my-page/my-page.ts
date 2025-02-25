"use server";

import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { UserType } from "@/types/user";


// Update user information
export const updateUserInfo = async (updatedData: {
  name?: string;
  profileImageUrl?: string | null;
}): Promise<{
  success: boolean;
  message: string;
  user: Omit<UserType, "email" | "userFamilies">;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance()
    const response = await axiosInstance.patch("/me", updatedData);
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error();
    } else {
      throw new Error(String(err));
    }
  }
};


// Delete user information
export const deleteUserInfo = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.delete("/me");
    return response.data

  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    throw new Error("Failed to delete user");
  }
};

// Update userFamilies information
export const updateFamilyInfo = async (updatedData: {
  familyId: string;
  name?: string;
  profileImageUrl?: string | null;
}): Promise<{
  success: boolean;
  message: string;
  familyMember: { id: string; name: string; profileImageUrl: string | null };
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance()
    const response = await axiosInstance.patch(`/me/family/${updatedData.familyId}`, updatedData);
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error();
    } else {
      throw new Error(String(err));
    }
  }
};

// Add family member
export const addFamilyMember = async (familyData: {
  name: string;
  profileImageUrl?: string | null;
}) => {
  try {
    const axiosInstance = await getServerAxiosInstance()
    const response = await axiosInstance.post(`/me/family`, familyData);
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "Unknown error occurred");
    } else {
      throw new Error(String(err));
    }
  }
};


// Delete user information
export const deleteFamilyInfo = async (
  familyId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.delete(`/me/family/${Number(familyId)}`);
    return response.data
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    throw new Error("Failed to delete family member");
  }
};
