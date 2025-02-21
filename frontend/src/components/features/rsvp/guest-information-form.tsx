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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getUserInfo } from "@/lib/api/user";
import { RsvpResponseType } from "@/types/rsvp-response";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { showErrorToast } from "@/lib/toast/toast-utils";

const formSchema = z.object({
  status: z.enum(["ACCEPT", "DECLINE"]),
  restriction: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .min(2, {
      message: "Email must be at least 2 characters.",
    }),
  message: z.string().optional(),
  companions: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type GuestInformationFormProps = {
  selection: RsvpResponseType["status"];
};

const GuestInformationForm = ({ selection }: GuestInformationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "ACCEPT",
      restriction: "",
      name: "",
      email: "",
      message: "",
      companions: [],
      termsAccepted: false,
    },
  });

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  // const { isLoaded, isSignedIn } = useAuth();
  const [familyMemberOptions, setFamilyMemberOptions] = useState<
    { name: string }[]
  >([]);
  const [companions, setCompanions] = useState<string[]>([]);
  const [newCompanionName, setNewCompanionName] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(
    form.getValues("termsAccepted"),
  );
  const [isEmailFetched, setIsEmailFetched] = useState(false);
  const [selectedFamilyValue, setSelectedFamilyValue] = useState<
    string | undefined
  >("");
  const [registeredFamilyMembers, setRegisteredFamilyMembers] = useState<
    string[]
  >([]);

  useEffect(() => {
    // Fetch user information when they are logged in
    const fetchUserInfo = async () => {
      // const { isLoaded, isSignedIn } = useAuth();

      // if (isLoaded && !isSignedIn) {
      //   return;
      // }

      try {
        const response = await getUserInfo();
        const userInformation = response.user;

        form.setValue("name", userInformation.name);
        form.setValue("email", userInformation.email);

        setFamilyMemberOptions(userInformation.userFamilies);
        setIsEmailFetched(true);

        const registeredFamily = userInformation.userFamilies.map(
          (member) => member.name,
        );

        setRegisteredFamilyMembers(registeredFamily);
      } catch (err: unknown) {
        showErrorToast(
          toast,
          err,
          "Failed to fetch user information. Please try again.",
        );
      }
    };

    fetchUserInfo();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // if (isLoaded && !isSignedIn) {
      //   return
      // }
      const eventId = params?.eventId;

      const postData: RsvpResponseType = {
        status: data.status,
        restriction: data.restriction || "",
        guest: {
          name: data.name,
          email: data.email,
        },
        companions: companions.map((companionName) => ({
          name: companionName,
        })),
        message: data.message || "",
        termsAccepted: termsAccepted,
      };

      const response = await axios.post(
        `/event/${eventId}/rsvp-form`,
        postData,
      );

      if (response.status !== 200) {
        throw new Error();
      }

      router.push(`/rsvp/${eventId}/submitted`);
    } catch (err: unknown) {
      showErrorToast(
        toast,
        err,
        "Failed to submit your RSVP. Please try again.",
      );
    }
  };

  // Companion
  const handleFamilySelectChange = (selectedValue: string) => {
    if (selectedValue && !companions.includes(selectedValue)) {
      setCompanions([...companions, selectedValue]);

      setFamilyMemberOptions(
        familyMemberOptions.filter((member) => member.name !== selectedValue),
      );

      setSelectedFamilyValue("");
    }
  };

  const handleAddCompanion = () => {
    if (newCompanionName.trim() === "") return;
    setCompanions([...companions, newCompanionName]);
    setNewCompanionName("");
  };

  const handleCompanionChange = (index: number, value: string) => {
    const updatedCompanions = [...companions];
    updatedCompanions[index] = value;
    setCompanions(updatedCompanions);
  };

  const handleDeleteFamilyMembers = (companion: string, index: number) => {
    const updatedCompanions = companions.filter(
      (companion) => companion !== companions[index],
    );

    setCompanions(updatedCompanions);

    // Add the companion back to the family options
    if (registeredFamilyMembers.includes(companion)) {
      setFamilyMemberOptions([
        ...familyMemberOptions,
        { name: companions[index] },
      ]);
    }
  };

  // Toggle terms accepted
  const handleTermsAgreement = () => {
    setTermsAccepted(!termsAccepted);
    form.setValue("termsAccepted", !termsAccepted);
  };

  return (
    <div>
      <h2 className="mb-4 mt-12 text-xl font-bold">Your Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">
                    Your name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="bg-white px-4 py-5">
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="font-semibold placeholder:text-textSub"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="bg-white px-4 py-5">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                      className="text-te font-semibold"
                      disabled={isEmailFetched}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {selection === "ACCEPT" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Companion</h3>
              <div className="mt-4">
                {companions.map((companion, index) => (
                  <div key={index} className="mt-2 flex items-center space-x-2">
                    <Input
                      value={companion}
                      onChange={(e) =>
                        handleCompanionChange(index, e.target.value)
                      }
                      className="mt-2 bg-white px-4 py-5 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteFamilyMembers(companion, index)
                      }
                      className="text-red-500"
                    >
                      <Image
                        src="/images/delete.svg"
                        width={200}
                        height={200}
                        alt="delete icon"
                        className="w-full"
                      />
                    </button>
                  </div>
                ))}
              </div>
              {/* If the user is logged in, they can select companions from their family. */}
              {familyMemberOptions.length > 0 && (
                <FormField
                  control={form.control}
                  name="companions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="w-full rounded-md bg-white px-4 py-5">
                        <Select
                          {...field}
                          value={selectedFamilyValue}
                          onValueChange={handleFamilySelectChange}
                        >
                          <SelectTrigger className="w-full bg-white px-4 py-5 text-sm font-semibold text-textSub">
                            <SelectValue placeholder="Select from your family" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {familyMemberOptions.map((member, index) => (
                                <SelectItem
                                  key={index}
                                  value={member.name}
                                  className="font-semibold"
                                >
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <div className="mt-4 space-y-2">
                <label className="pt-4 text-sm font-bold">
                  Companion name
                  <Input
                    value={newCompanionName}
                    onChange={(e) => setNewCompanionName(e.target.value)}
                    placeholder="Enter companion's name"
                    className="mt-2 bg-white px-4 py-5 font-semibold placeholder:text-textSub"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleAddCompanion}
                  className="ml-auto flex items-center gap-2 rounded-full border border-primary bg-white px-4 py-2 text-sm font-bold text-primary"
                >
                  <Image
                    src="/images/plus.svg"
                    width={16}
                    height={16}
                    alt="icon for add person"
                  />
                  <span>Add person</span>
                </button>
              </div>
            </div>
          )}
          {selection === "ACCEPT" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">
                  Allergies or dietary restrictions
                </h3>
                <p className="text-sm">
                  If you have any allergies or dietary restrictions, please let
                  us know.
                </p>
              </div>
              <FormField
                control={form.control}
                name="restriction"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="bg-white px-4 py-3">
                      <Textarea
                        placeholder="Enter your note"
                        {...field}
                        className="h-28 font-semibold placeholder:text-textSub"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${selection !== "ACCEPT" ? "text-sm" : ""}`}
            >
              Message to the host
            </h3>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="bg-white px-4 py-3">
                    <Textarea
                      placeholder="Enter your message"
                      {...field}
                      className="h-28 font-semibold placeholder:text-textSub"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="termsAccepted"
            render={() => (
              <FormItem>
                <FormControl className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTermsAgreement}
                    className="flex items-center gap-2 rounded-full font-bold text-white"
                  >
                    {form.getValues("termsAccepted") ? (
                      <Image
                        src="/images/checked.svg"
                        width={16}
                        height={16}
                        alt="icon for add unchecked"
                      />
                    ) : (
                      <Image
                        src="/images/unchecked.svg"
                        width={16}
                        height={16}
                        alt="icon for add checked"
                      />
                    )}
                    <span className="text-sm font-medium text-text">
                      I agree with the Terms and Conditions.
                    </span>
                  </button>
                </FormControl>
                <FormMessage className="mt-2 text-sm text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full rounded-[40px] py-8 text-lg font-bold"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GuestInformationForm;
