// import { PreviewPictureType } from "@/types/album";
import Image from "next/image";
import Link from "next/link";

// type FacesSectionProps = {
//   facesData: PreviewPictureType[]
// }

export default function FacesSection() {
  return (
    <section className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="text-xl font-bold">Faces of the Event</h2>
        <p className="text-sm text-textSub">
          AI creates a personal album for everyone.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-[6px]">
        <Link href={`album/pictures?tag`} className="w-full cursor-pointer">
          <Image
            src="/images/sample-thumbnail.png"
            alt="test"
            width={168}
            height={184}
            className="h-[184px] w-full rounded-lg object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
