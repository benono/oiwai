export type UserType = {
  id: string;
  name: string;
  profileImageUrl: string;
  email: string;
  family: { id: string; profileImageUrl: string; name: string }[];
};
