"use client";

import MapFunction from "@/components/features/create-invitation/MapWithMarkers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { createInvitation } from "@/lib/actions/create-invitation/create-invitaion";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import router from "next/router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startTime: z.string(),
  endTime: z.string(),
  country: z.string(),
  postalCode: z.string(),
  province: z.string(),
  city: z.string(),
  address1: z.string(),
  address2: z.string(),
  thumbnail: z.custom<File[]>().optional(),
  date: z.date({
    required_error: "A date of an event is required.",
  }),
  isAskRestrictions: z.boolean({
    required_error: "Please select an options to display.",
  }),
  theme: z.string({
    required_error: "Please select a theme to display.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateEventPage() {
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string>("");
  const handleEventTypeChange = (value: string) => {
    setEventType(value);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startTime: "",
      endTime: "",
      country: "",
      postalCode: "",
      province: "",
      city: "",
      address1: "",
      address2: "",
      isAskRestrictions: false,
      theme: "",
      thumbnail: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnail", [file]);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleImageClick = () => {
    inputImageRef.current?.click();
  };

  const onSubmit = async (requestData: FormData) => {
    let response;
    try {
      if (!requestData.thumbnail || requestData.thumbnail.length === 0) {
        throw new Error("Please upload a thumbnail image.");
      }

      const date = new Date(requestData.date);
      const targetDate = date.toISOString().replace(/T.*Z$/, "");

      const formattedStartTime = new Date(
        `${targetDate}T${requestData.startTime}:00`,
      ).toISOString();

      const formattedEndTime = new Date(
        `${targetDate}T${requestData.endTime}:00`,
      ).toISOString();

      response = await createInvitation({
        requestData: {
          event: {
            ...requestData,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
          thumbnail: requestData.thumbnail[0],
        },
      });

      if (response?.success) {
        router.push(`/event/created`);
      }
    } catch (err) {
      if (err instanceof Error) {
        showErrorToast(toast, err, err.message);
      } else {
        showErrorToast(
          toast,
          err,
          "An error occurred while processing your request. Please try again.",
        );
      }
    }
  };
  const handleAddressSelect = (place: Place) => {
    console.log("取得データ", place.address);
    const addressParts = place.address
      .split(",")
      .map((part: string) => part.trim());

    const streetAddress = addressParts[0] || "";
    const city = addressParts[1] || "";
    const province = addressParts[2] || "";
    const postalCode = addressParts[3] || "";
    const country = addressParts[4] || "";

    form.setValue("address1", streetAddress);
    form.setValue("city", city);
    form.setValue("province", province);
    form.setValue("postalCode", postalCode);
    form.setValue("country", country);
  };

  return (
    <section className="container mx-auto space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <div
                  className="relative flex h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg"
                  onClick={handleImageClick}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={500}
                      height={500}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="relative h-full w-full rounded-lg border-2 border-dashed border-gray-400 bg-background">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlusIcon className="h-8 w-8 text-textSub" />
                      </div>
                      <p className="absolute bottom-2 w-full text-center text-sm font-bold text-textSub">
                        Add an image of the guest of honor!
                      </p>
                    </div>
                  )}
                  <FormControl>
                    <input
                      type="file"
                      ref={(e) => {
                        field.ref(e);
                        inputImageRef.current = e;
                      }}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleImageChange(e);
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="text"
                    placeholder="Add Event Title"
                    className="w-full border-gray-300 py-4 text-2xl font-bold outline-none placeholder:text-textBorder focus:border-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date and Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className="w-full bg-white">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-10 w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="startTime"
              render={() => (
                <FormItem className="flex w-full flex-col space-y-2">
                  <FormLabel className="font-semibold">Start time</FormLabel>
                  <FormControl>
                    <Controller
                      name="startTime"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          type="time"
                          id="start-time"
                          {...field}
                          className="h-10 rounded-md border border-border p-4 font-medium"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={() => (
                <FormItem className="flex w-full flex-col space-y-2">
                  <FormLabel className="font-semibold">End time</FormLabel>
                  <FormControl>
                    <Controller
                      name="endTime"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          type="time"
                          id="end-time"
                          {...field}
                          className="h-10 rounded-md border border-border p-4 font-medium"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Select onValueChange={handleEventTypeChange}>
            <FormControl className="h-10">
              <SelectTrigger>
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="homeParty">Home party</SelectItem>
              <SelectItem value="outside">Outside</SelectItem>
            </SelectContent>
          </Select>

          {eventType === "outside" ? (
            <Tabs defaultValue="Current location" className="w-full">
              <TabsList className="flex w-full bg-transparent">
                <TabsTrigger
                  value="Current location"
                  className="w-full border-b-2 border-textBorderLight bg-transparent pb-2 font-bold data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accentGreen data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-accentGreen data-[state=active]:shadow-none"
                >
                  Current location
                </TabsTrigger>
                <TabsTrigger
                  value="Based on activities"
                  className="w-full border-b-2 border-textBorderLight bg-transparent pb-2 font-bold data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accentGreen data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-accentGreen data-[state=active]:shadow-none"
                >
                  Based on activities
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Current location">
                <MapFunction onPlaceSelect={handleAddressSelect} />
              </TabsContent>
              <TabsContent value="Based on activities">
                <MapFunction onPlaceSelect={handleAddressSelect} />
              </TabsContent>
            </Tabs>
          ) : (
            <MapFunction onPlaceSelect={handleAddressSelect} />
          )}

          <FormField
            control={form.control}
            name="isAskRestrictions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
                <FormLabel>Ask allergies or dietary restrictions</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="m-0 p-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invitation Theme</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="h-16">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an invitation theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="#FF8549">
                      <div className="flex h-full w-full items-center gap-2">
                        <Image
                          src="/images/theme-orange.png"
                          alt="Preview"
                          width={500}
                          height={500}
                          className="h-10 w-[70px] rounded object-cover"
                        />
                        <p>Orange</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="#1A74A2">
                      <div className="flex h-full w-full items-center gap-2">
                        <Image
                          src="/images/theme-blue.png"
                          alt="Preview"
                          width={500}
                          height={500}
                          className="h-10 w-[70px] rounded object-cover"
                        />
                        <p>Blue</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="#7E4F8F">
                      <div className="flex h-full w-full items-center gap-2">
                        <Image
                          src="/images/theme-purple.png"
                          alt="Preview"
                          width={500}
                          height={500}
                          className="h-10 w-[70px] rounded object-cover"
                        />
                        <p>Purple</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base font-bold"
          >
            Create invitation
          </Button>
        </form>
      </Form>
    </section>
  );
}
