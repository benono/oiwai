import { UserType } from "@/types/user";

// Fetch user information
export const getUserInfo = async (): Promise<UserType> => {
  try {
    // const axios = useAuthAxios();
    // const response = await axios.get("/me");

    return {
      // Dummy data
      id: "12345",
      name: "John Doe",
      profileImageUrl: "https://example.com/profile.jpg",
      email: "johndoe@example.com",
      family: [
        {
          id: "67890",
          profileImageUrl: "https://example.com/family_member.jpg",
          name: "Jane Doe",
        },
        {
          id: "11223",
          profileImageUrl: "https://example.com/family_member_2.jpg",
          name: "Sam Doe",
        },
      ],
    };
  } catch (err) {
    throw new Error("User not found");
  }
};
