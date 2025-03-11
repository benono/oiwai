"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthAxios } from "@/lib/api/axios-client";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { ReviewType } from "@/types/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "../album/loader";

const MAX_FILE_SIZE_MB = 3;
const MAX_TOTAL_SIZE_MB = 15;
const MAX_FILE_COUNT = 4;

type CreateReviewFormProps = {
  initialReviewData?: ReviewType;
};

const reviewSchema = z.object({
  reviewMessage: z.string().min(1, { message: "Review cannot be empty." }),
  images: z
    .array(z.instanceof(File))
    // .array(z.any())
    .max(4, { message: "You can upload up to 4 images." }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function CreateReviewForm({
  initialReviewData,
}: CreateReviewFormProps) {
  const axios = useAuthAxios();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFilesData, setImageFilesData] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const eventId = params?.eventId;
  const inputImageRef = useRef<HTMLInputElement>(null!);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewMessage: initialReviewData?.message || "",
      images: [],
    },
  });

  const { control, handleSubmit, setValue } = form;

  const revokeObjectURL = useCallback(() => {
    previewImages.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviewImages([]);
  }, [previewImages]);

  const handleFileInputClick = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    // check for the same images
    const existingFileNames = new Set(imageFilesData.map((file) => file.name));
    const uniqueFiles = newFiles.filter(
      (file) => !existingFileNames.has(file.name),
    );

    if (uniqueFiles.length === 0) return;

    // check for max images
    const availableSlots = MAX_FILE_COUNT - imageFilesData.length;
    const filesToAdd = uniqueFiles.slice(0, availableSlots);

    const newImageFilesData = [...imageFilesData, ...filesToAdd];
    setImageFilesData(newImageFilesData);

    setValue("images", newImageFilesData);

    const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newImageUrls]);
  };

  const handleDelete = (index: number) => {
    const url = previewImages[index];

    const updatedImageUrls = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImageUrls);

    const updatedImageUrlsData = imageFilesData.filter((_, i) => i !== index);
    setImageFilesData(updatedImageUrlsData);

    setValue("images", updatedImageUrlsData);

    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  // NOTE: for edit
  // useEffect(() => {
  //   if (initialReviewData) {
  //     reset({
  //       reviewMessage: initialReviewData.message || "",
  //       images: [],
  //     });

  //     if (initialReviewData.images && initialReviewData.images.length > 0) {
  //       setPreviewImages(initialReviewData.images || []);
  //       setValue("images", initialReviewData.images);
  //     }
  //   }

  //   return () => {
  //     revokeObjectURL();
  //   };
  // }, [initialReviewData, reset, setValue]);

  const onSubmit = async (data: ReviewFormValues) => {
    const overSizedFiles = imageFilesData.filter(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
    );

    if (overSizedFiles.length > 0) {
      showErrorToast(
        toast,
        new Error("Upload Error"),
        "Each image must be under 8MB. Please resize and try again.",
      );
      return;
    }

    const totalSize = imageFilesData.reduce((acc, file) => acc + file.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);
    if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
      showErrorToast(
        toast,
        new Error("Upload error"),
        "The total file size exceeds 70MB. Please reduce the image size or remove some and try again.",
      );
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("reviewMessage", data.reviewMessage);

      imageFilesData.forEach((file) => {
        formData.append("images", file);
      });

      // NOTE: for edit
      // if(initialReviewData?.images) {
      //   initialReviewData.images.forEach(imageData => {
      //     if(typeof imageData === "string" && !imageData.startsWith("blob:")) {
      //       formData.append("existingImages", imageData)
      //     }
      //   })
      // }

      const response = await axios.post(`/event/${eventId}`, formData);

      if (response.status !== 200) {
        throw new Error();
      }
      revokeObjectURL();
      router.push(`/event/${eventId}`);
    } catch (err) {
      showErrorToast(toast, err, "Error submitting the review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={control}
          name="reviewMessage"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-bold">
                Share your thoughts on the event
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2">
          <FormLabel className="text-sm font-bold">
            Share your favorite moment
          </FormLabel>
          <p className="text-[13px] font-medium text-textSub">
            Upload your favorite event photos by uploading them here!
          </p>
          <p className="text-right text-sm font-medium text-textSub">
            {imageFilesData.length ? imageFilesData.length : 0}/4
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {imageFilesData.length < MAX_FILE_COUNT && (
              <li
                className="flex h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-textBorderLight bg-background hover:opacity-70"
                onClick={handleFileInputClick}
              >
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  hidden
                  ref={inputImageRef}
                  onChange={handleFileChange}
                />
                <PlusIcon size={24} className="text-textSub" />
              </li>
            )}
            {previewImages.map((image, index) => (
              <li key={index} className="relative h-[120px]">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={164}
                  height={120}
                  className="h-[120px] w-full rounded-xl object-cover"
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(index);
                  }}
                  variant="ghost"
                  className="absolute right-2 top-2 flex h-auto items-center justify-center rounded-full bg-text/50 p-1 hover:bg-text/50"
                >
                  <X size={12} className="h-3 w-3 text-white" />
                </Button>
              </li>
            ))}
          </ul>

          <FormMessage>{form.formState.errors.images?.message}</FormMessage>
        </div>

        <div className="grid gap-2">
          <Button
            type="submit"
            className="h-auto w-full rounded-full py-3 text-base font-bold"
          >
            {isLoading ? <Loader /> : "Submit"}
          </Button>
          <p className="text-sm font-medium text-textSub">
            Your message and photos will be shared with all participants of the
            event!
          </p>
        </div>
      </form>
    </Form>
  );
}
