import { UserType } from "@/types/user";
// import { axiosInstance } from "./axios-client";

// Fetch user information
export const getUserInfo = async (): Promise<UserType> => {
  try {
    // const axios = useAuthAxios();
    // const response = await axios.get("/me");

    return {
      // Dummy data
      id: "12345",
      name: "John Doe",
      profileImageUrl: "/images/sample_profile.png",
      email: "johndoe@example.com",
      userFamilies: [
        {
          id: "67890",
          profileImageUrl: "/images/sample_profile.png",
          name: "Jane Doe",
        },
        {
          id: "11223",
          profileImageUrl: "/images/sample_profile.png",
          name: "Sam Doe",
        },
      ],
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    throw new Error("User not found");
  }
};

// Update user information
export const updateUserInfo = async (updatedData: {
  name?: string;
  profileImageUrl?: string | null;
}): Promise<{ success: boolean; message: string; user: Omit<UserType, "email" | "userFamilies"> }> => {
  try {
    // const axiosInstance = await getServerAxiosInstance()
    // const response = await axiosInstance.patch("/me", updatedData);
    // return response.data;

    return Promise.resolve({
      success: true,
      message: "User updated successfully",
      user: {
        id: "12345",
        name: updatedData.name ?? "Tracy",
        profileImageUrl: updatedData.profileImageUrl ?? "/images/profile_default.png"
      }
    })

  } catch (err) {
    if (err instanceof Error) {
      throw new Error();
    } else {
      throw new Error(String(err));
    }
  }
};

// Update userFamilies information
export const updateFamilyInfo = async (updatedData: {
  familyId: string;
  name?: string;
  profileImageUrl?: string | null;
}): Promise<{ success: boolean; message: string; familyMember: { id: string; name: string; profileImageUrl: string | null } }> => {
  try {
    // const axiosInstance = await getServerAxiosInstance()
    // const response = await axiosInstance.patch(`/me/family/${updatedData.familyId}`, updatedData);
    // return response.data;


    return Promise.resolve({
      success: true,
      message: "User updated successfully",
      familyMember: {
        id: updatedData.familyId,
        name: updatedData.name ?? "Tracy",
        profileImageUrl: updatedData.profileImageUrl ?? "/images/profile_default.png"
      }
    })

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
    // const axiosInstance = await getServerAxiosInstance()
    // const response = await axiosInstance.patch(`/me/family`, familyData);
    // return response.data;

    return Promise.resolve({
      success: true,
      message: "Family member added successfully",
      familyMember: {
        name: familyData.name,
        profileImageUrl: familyData.profileImageUrl ?? "/images/profile_default.png"
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "Unknown error occurred");
    } else {
      throw new Error(String(err));
    }
  }
}
