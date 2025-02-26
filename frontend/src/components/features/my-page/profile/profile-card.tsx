import { deleteUserInfo } from "@/lib/actions/my-page/my-page";
import Image from "next/image";
import EditDeleteButtons from "../edit-delete/edit-delete-buttons";

type ProfileCardProps = {
  name: string;
  email: string;
  profileImageUrl: string;
  refreshData: () => void; // refreshData type
};

export default function ProfileCard({
  name,
  email,
  profileImageUrl,
  refreshData,
}: ProfileCardProps) {
  return (
    <div className="grid justify-items-center gap-2">
      <Image
        src={profileImageUrl}
        alt={name}
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="grid gap-1 text-center">
        <h1 className="text-base font-bold text-text">{name}</h1>
        <p className="text-xs text-textSub">{email}</p>
      </div>
      <EditDeleteButtons
        title="Edit account"
        deleteTitle="Delete account"
        deleteDescription="Are you sure you want to delete the account? This action cannot be undone."
        button="Delete"
        defaultName={name}
        defaultImage={profileImageUrl}
        type="user"
        errorMessage="Failed to update information. Please try again."
        deleteErrorMessage="Failed to delete user. Please try again."
        userDeleteAction={deleteUserInfo}
        refreshData={refreshData} // Pass refreshData function
      />
    </div>
  );
}
