"use server";

// Delete user information
export const deleteUserInfo = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // const axiosInstance = await getServerAxiosInstance();
    // const response = await axiosInstance.delete("/me");
    // return response.data

    return Promise.resolve({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    throw new Error("Failed to delete user");
  }
};

// Delete user information
export const deleteFamilyInfo = async (
  familyId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // NOTE: uncomment after import RSVP PR
    // const axiosInstance = await getServerAxiosInstance();
    // const response = await axiosInstance.delete(`/me/family/${familyId}`);
    // return response.data

    return Promise.resolve({
      success: true,
      // NOTE: Using familyID just to avoid an unused error
      message: `Family member ${familyId} deleted successfully`,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    throw new Error("Failed to delete family member");
  }
};
