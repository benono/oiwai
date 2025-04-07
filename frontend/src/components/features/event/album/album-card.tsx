import { BasePictureType } from "@/types/album";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AlbumCardProps = {
  albumData: BasePictureType[];
};

export default function AlbumCard({ albumData }: AlbumCardProps) {
  return (
    <div className="grid grid-cols-2 gap-[6px] rounded-lg p-2 shadow-[0px_5px_32px_rgba(0,0,0,0.16)]">
      {albumData.map(({ id, imageUrl }) => (
        <Link key={id} href="album/pictures" className="cursor-pointer">
          <Image
            src={imageUrl}
            alt="test"
            width={160}
            height={120}
            className="h-32 w-full rounded-lg bg-transparent object-cover"
          />
        </Link>
      ))}
      <Link
        href="album/post"
        className="flex h-32 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-textBorderLight bg-textBorderLight hover:opacity-70"
      >
        <PlusIcon size={24} className="text-textSub" />
        <p className="text-lg font-bold text-textSub">Add</p>
      </Link>
    </div>
  );
}
