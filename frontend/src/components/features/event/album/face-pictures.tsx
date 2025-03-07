// import { getAllPicturesByTag } from "@/lib/actions/event/album";
import Image from "next/image";
import Link from "next/link";
// import { notFound } from "next/navigation";

type FacePicturesProps = {
  eventId: string;
  tag: string;
};

export default async function FacePictures({
  // eventId,
  // tag,
}: FacePicturesProps) {
  // let facePicturesData;

  // try {
  //   facePicturesData = await getAllPicturesByTag(eventId, tag);

  //   if (!facePicturesData) {
  //     throw new Error("Face photo data is missing");
  //   }
  // } catch (err) {
  //   console.error(err);
  //   notFound();
  // }

  return (
    <section className="grid gap-4">
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
