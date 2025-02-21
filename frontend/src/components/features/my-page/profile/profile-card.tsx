import { Button } from "@/components/ui/button";
import { PencilLineIcon, UserRoundXIcon } from "lucide-react";
import Image from "next/image";
import Modal from "../../modal";

type ProfileCardProps = {
  name: string;
  email: string;
  profileImageUrl: string;
};

export default function ProfileCard({
  name,
  email,
  profileImageUrl,
}: ProfileCardProps) {
  return (
    <div className="grid justify-items-center gap-2">
      <Image
        src={profileImageUrl}
        alt={name}
        width={64}
        height={64}
        className="rounded-full object-cover"
      />
      <div className="grid gap-1 text-center">
        <h1 className="text-base font-bold text-text">{name}</h1>
        <p className="text-xs text-textSub">{email}</p>
      </div>
      <div className="flex gap-2">
        <Modal
          trigger={
            <Button className="h-8 w-8 rounded-full bg-error/15 text-error shadow-none hover:bg-error/15 hover:opacity-70">
              <UserRoundXIcon size={16} />
            </Button>
          }
          title="Delete account"
          description="Are you sure you want to delete the account? This action cannot be undone."
          button={
            <Button className="w-full bg-error font-bold shadow-none hover:bg-error hover:opacity-70">
              Delete
            </Button>
          }
        />
        <Modal
          trigger={
            <Button className="h-8 w-8 rounded-full bg-textSub/20 text-textSub shadow-none hover:bg-textSub/20 hover:opacity-70">
              <PencilLineIcon />
            </Button>
          }
          title="Edit account"
          button={
            <Button className="w-full font-bold shadow-none">Update</Button>
          }
        >
          <p>Hello</p>{" "}
        </Modal>
      </div>
    </div>
  );
}
