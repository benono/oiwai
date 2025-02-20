import { UserType } from "@/types/user";

// Fetch user information
export const getUserInfo = async (): Promise<UserType> => {
  try {
    // const axiosInstance = await getServerAxiosInstance();
    // const response = await axiosInstance.fetch('/me');

    return {
      // Dummy data
      user: {
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
      },
    };
  } catch (err) {
    alert(err); // TODO: use toast
    return {
      user: {
        id: "",
        name: "",
        profileImageUrl: "",
        email: "",
        family: [],
      },
    };
  }
};
