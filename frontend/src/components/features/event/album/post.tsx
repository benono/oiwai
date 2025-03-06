"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addPictures } from "@/lib/actions/event/album";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { PlusIcon, X } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

type PostProps = {
  eventId: string;
};

const MAX_FILE_SIZE_MB = 8;
const MAX_TOTAL_SIZE_MB = 70;
const MAX_FILE_COUNT = 20;

export default function Post({ eventId }: PostProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlsData, setImageUrlsData] = useState<File[]>([]);

  const { toast } = useToast();
  const router = useRouter();
  const inputImageRef = useRef<HTMLInputElement>(null!);

  const revokeObjectURL = useCallback(() => {
    imageUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setImageUrls([]);
  }, [imageUrls]);

  const handleFileInputClick = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const imageFiles = Array.from(e.target.files);

    // check for same photo
    const existingFileNames = new Set(imageUrlsData.map((file) => file.name));
    const uniqueFiles = imageFiles.filter(
      (file) => !existingFileNames.has(file.name),
    );

    if (uniqueFiles.length === 0) return;
    setImageUrlsData((prev) => [...prev, ...uniqueFiles]);

    const newImageUrls = uniqueFiles.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newImageUrls]);
  };

  const handleDelete = (index: number, url: string) => {
    const deletedImageUrls = imageUrls.filter((_, i) => i !== index);
    const deletedImageUrlsData = imageUrlsData.filter((_, i) => i !== index);
    setImageUrls(deletedImageUrls);
    setImageUrlsData(deletedImageUrlsData);

    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handlePost = async (e: React.MouseEvent) => {
    e.preventDefault();
    let response;

    if (imageUrlsData.length === 0) {
      showErrorToast(toast, "Please select at least one image.");
      setIsLoading(false);
      return;
    }

    // check size for one image
    const oversizedFiles = imageUrlsData.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showErrorToast(toast, "Each image must be under 8MB. Please resize and try again.");
      setIsLoading(false);
      return;
    }

    // check total number
    if(imageUrlsData.length > MAX_FILE_COUNT) {
      showErrorToast(toast, "You can upload up to 20 images at once.")
      setIsLoading(false);
      return;
    }

    // check total images size
    const totalSize = imageUrlsData.reduce((acc, file) => acc + file.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);
    if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
      showErrorToast(toast, "The total file size exceeds 1MB. Please reduce the image size and try again.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      response = await addPictures(eventId, imageUrlsData);

      if (!response?.success) {
        notFound();
      }

      setImageUrls([]);
      setImageUrlsData([]);
      revokeObjectURL();
      router.push(`/event/${eventId}/album/pictures`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast(toast, err.message);
      } else {
        showErrorToast(toast, "Unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid gap-4">
      <Button
        onClick={handlePost}
        className="h-auto w-fit justify-self-end rounded-full px-8 py-2"
      >
        {isLoading ? "Loading..." : "Post"}
      </Button>
      <ul className="grid grid-cols-3 gap-[2px]">
        <li
          className="flex cursor-pointer items-center justify-center hover:opacity-70"
          onClick={handleFileInputClick}
        >
          <input
            type="file"
            name="images"
            multiple
            hidden
            ref={inputImageRef}
            onChange={handleFileChange}
          />
          <PlusIcon size={24} className="text-primary" />
        </li>
        {imageUrls.map((image, index) => (
          <li className="h-[100px] hover:opacity-70" key={index}>
            <button
              className="relative h-auto w-full"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(index, image);
              }}
            >
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-text/50">
                <X size={14} className="text-white" />
              </div>
              <Image
                src={image}
                alt="test"
                width={124}
                height={100}
                className="h-[100px] object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </form>
  );
}
