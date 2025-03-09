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
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  FerrisWheel,
  House,
  PlusIcon,
} from "lucide-react";
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
  thumbnailUrl: z.custom<File[]>().optional(),
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
  const [eventType, setEventType] = useState<string>("homeParty");

  const [theme, setTheme] = useState<string>("#FF8549");

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
      theme: "#FF8549",
      thumbnailUrl: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnailUrl", [file]);
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
      if (!requestData.thumbnailUrl || requestData.thumbnailUrl.length === 0) {
        throw new Error("Please upload a thumbnail image.");
      }

      const { address1, city, province, postalCode, country } = requestData;
      if (!address1 || !city || !province || !postalCode || !country) {
        throw new Error("Please select a valid address.");
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
          thumbnail: requestData.thumbnailUrl[0],
        },
      });

      if (response?.success) {
        alert("成功！");
        router.push(`/event/created`);
        return;
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

  const handleAddressSelect = (place: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    console.log(place);

    // latitude and longitude
    // form.setValue("latitude", place.location.lat);
    // form.setValue("longitude", place.location.lng);

    form.setValue("address1", "978 Granville St");
    form.setValue("city", "Vancouver");
    form.setValue("province", "BC");
    form.setValue("postalCode", "V6Z 1L2");
    form.setValue("country", "Canada");
  };

  return (
    <section className="container mx-auto space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="thumbnailUrl"
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
                      className="h-full w-full rounded object-cover"
                    />
                  ) : (
                    <div className="relative h-full w-full rounded-lg border border-dashed border-textBorder bg-background">
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
                    className="w-full py-4 text-2xl font-bold outline-none placeholder:text-textBorder"
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
                <FormLabel className="font-semibold">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className="w-full bg-white text-base hover:bg-white">
                      <Button
                        variant="outline"
                        className="flex h-10 w-full justify-start pl-3 text-left"
                      >
                        <CalendarIcon size={16} className="text-textSub" />
                        {field.value ? (
                          <span className="font-normal">
                            {format(field.value, "PPP")}
                          </span>
                        ) : (
                          <span className="text-textSub">Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="font-bold"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full gap-6">
            <FormField
              control={form.control}
              name="startTime"
              render={() => (
                <FormItem className="flex w-full flex-col space-y-2">
                  <FormLabel className="font-semibold">Start time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <button
                        type="button"
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        onClick={() => {
                          const startTimeInput = document.getElementById(
                            "start-time-input",
                          ) as HTMLInputElement;
                          startTimeInput?.showPicker();
                        }}
                      >
                        <Clock size={16} className="text-textSub" />
                      </button>
                      <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            type="time"
                            id="start-time-input"
                            {...field}
                            className="font-base h-10 w-full rounded-md border border-border p-4 pl-10"
                          />
                        )}
                      />
                    </div>
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
                    <div className="relative flex">
                      <button
                        type="button"
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        onClick={() => {
                          const startTimeInput = document.getElementById(
                            "end-time-input",
                          ) as HTMLInputElement;
                          startTimeInput?.showPicker();
                        }}
                      >
                        <Clock size={16} className="text-textSub" />
                      </button>
                      <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            type="time"
                            id="end-time-input"
                            {...field}
                            className="font-base h-10 w-full rounded-md border border-border p-4 pl-10"
                          />
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem className="flex flex-col">
            <FormLabel className="font-semibold">Event type</FormLabel>
            <Select
              defaultValue="homeParty"
              value={eventType}
              onValueChange={handleEventTypeChange}
            >
              <FormControl className="h-10">
                <SelectTrigger
                  className={`${eventType ? "text-black" : "text-textSub"}`}
                >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="homeParty">
                  <div className="flex h-6 items-center gap-2 text-base">
                    <House size={16} className="text-textSub" />
                    Home party
                  </div>
                </SelectItem>
                <SelectItem value="outside">
                  <div className="flex h-6 items-center gap-2 text-base">
                    <FerrisWheel size={16} className="text-textSub" />
                    Outside
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

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
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-semibold">Options</FormLabel>
                <FormItem className="flex h-12 flex-row items-center justify-between rounded-lg border px-4 shadow-sm">
                  <FormLabel className="text-sm">
                    Ask allergies or dietary restrictions
                  </FormLabel>
                  <FormControl style={{ margin: 0 }}>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-accentGreen data-[state=checked]:bg-accentGreen"
                    />
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Invitation Theme
                </FormLabel>
                <Select
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value);
                    field.onChange(value);
                  }}
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
                        <p className="text-base font-medium">Orange</p>
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
                        <p className="text-base font-medium">Blue</p>
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
                        <p className="text-base font-medium">Purple</p>
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
            className={`h-12 w-full rounded-full text-base font-bold ${
              theme === "#FF8549"
                ? "bg-primary"
                : theme === "#1A74A2"
                  ? "bg-accentBlue"
                  : theme === "#7E4F8F"
                    ? "bg-accentPurple"
                    : ""
            }`}
          >
            Create invitation
          </Button>
        </form>
      </Form>
    </section>
  );
}
