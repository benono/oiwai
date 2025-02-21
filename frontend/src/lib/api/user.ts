import { UserType } from "@/types/user";

// Fetch user information
export const getUserInfo = async (): Promise<{ user: UserType }> => {
  try {
    // const axios = useAuthAxios();
    // const response = await axios.get("/me");

    return {
      // Dummy data
      user: {
        id: "12345",
        name: "Tracy",
        profileImageUrl: "/images/sample-family-1.png",
        email: "tracy@example.com",
        userFamilies: [
          {
            id: "67890",
            profileImageUrl: "/images/sample-family-1.png",
            name: "Jane Doe",
          },
          {
            id: "11223",
            profileImageUrl: "/images/sample-family-2.png",
            name: "Sam Doe",
          },
        ],
      },
    };
  } catch (err) {
    throw new Error("User not found");
  }
};
