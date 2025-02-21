export type UserType = {
  id: string;
  name: string;
  profileImageUrl: string;
  email: string;
  family: { id: string; profileImageUrl: string; name: string }[];
};

export type FamilyMemberType = {
  id: string;
  profileImageUrl: string;
  name: string;
};

export type MyPageUserType = {
  user: {
    id: string;
    name: string;
    profileImageUrl: string;
    email: string;
    userFamilies: FamilyMemberType[]
  };
};
