'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

type GuestInformationFormType = {
  selection: string
}

const formSchema = z.object({
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
  restrictions: z.string().optional(),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>;

const GuestInformationForm = ({ selection }: GuestInformationFormType) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      restrictions: "",
      message: "",
    },
  });

  const [companions, setCompanions] = useState<string[]>([]);
  const [newCompanionName, setNewCompanionName] = useState<string>("");

  const addCompanion = () => {
    if (newCompanionName.trim() === "") return;
    setCompanions([...companions, newCompanionName]);
    setNewCompanionName("");
  };

  const handleCompanionChange = (index: number, newName: string) => {
    const updatedCompanions = [...companions];
    updatedCompanions[index] = newName;
    setCompanions(updatedCompanions);
  };

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, companions });
    alert("Form submitted successfully!");
  }

  return (
    <div>
      <h2 className="mb-4 mt-12 text-xl font-bold">Your Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      className="font-medium text-textSub"
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
                      className="font-medium text-textSub"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Only attendees can see the companion and restrictions. */}
          {selection === "accept" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Companion</h3>
              {companions.map((companion, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    value={companion}
                    onChange={(e) =>
                      handleCompanionChange(index, e.target.value)
                    }
                    className="bg-white px-4 py-5 font-semibold"
                  />
                </div>
              ))}
              <div className="mt-4 space-y-2">
                <label className="pt-4 text-sm font-bold">
                  Companion name
                  <Input
                    value={newCompanionName}
                    onChange={(e) => setNewCompanionName(e.target.value)}
                    placeholder="Enter companion's name"
                    className="mt-2 bg-white px-4 py-5 font-semibold"
                  />
                </label>
                <button
                  type="button"
                  onClick={addCompanion}
                  className="ml-auto flex items-center gap-2 rounded-full border border-primary bg-white px-4 py-2 text-sm font-bold text-primary"
                >
                  <Image
                    src="/plus.svg"
                    width={16}
                    height={16}
                    alt="icon for add person"
                  />
                  <span>Add person</span>
                </button>
              </div>
            </div>
          )}
          {selection === "accept" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">
                  Allergies or dietary restrictions
                </h3>
                <p className="text-sm font-medium">
                  If you have any allergies or dietary restrictions, please let
                  us know.
                </p>
              </div>
              <FormField
                control={form.control}
                name="restrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="bg-white px-4 py-3">
                      <Textarea
                        placeholder="Enter your note"
                        {...field}
                        className="h-28 font-medium text-textSub"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
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
                      className="h-28 font-medium text-textSub"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.email === undefined &&
            form.getValues("email") && (
              <div className="space-y-2">
                <span>I agree with the Terms and Conditions.</span>
              </div>
            )}
          <Button
            type="submit"
            className="w-full rounded-[40px] py-8 text-lg font-bold"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default GuestInformationForm;