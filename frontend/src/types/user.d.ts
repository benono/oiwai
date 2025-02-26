export type FamilyMemberType = {
  id: string;
  profileImageUrl: string;
  name: string;
  isDeleted: boolean;
};

export type UserType = {
  id: string;
  name: string;
  profileImageUrl: string;
  email: string;
  userFamilies: FamilyMemberType[];
};
