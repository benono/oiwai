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
    companionName: z.string().min(2, {
    message: "Companion name must be at least 2 characters.",
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
      companionName: "",
      restrictions: "",
      message: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  return (
    <div>
      <h2 className="font-bold text-xl mt-12 mb-4">Your Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">
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
                  <FormLabel className="font-bold text-sm">
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
              <h3 className="font-bold text-lg">Companion</h3>
              <FormField
                control={form.control}
                name="companionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">
                      Companion name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="bg-white px-4 py-5">
                      <Input
                        placeholder="Enter your companion’s name"
                        {...field}
                        className="font-medium text-textSub"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button className="ml-auto text-sm font-bold text-primary px-4 py-2 border border-primary bg-white rounded-full flex items-center gap-2">
                <Image
                  src="/plus.svg"
                  width={16}
                  height={16}
                  alt="icon for shortening long url"
                />
                <span>Add person</span>
              </button>
            </div>
          )}
          {selection === "accept" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Allergies or dietary restrictions</h3>
                <p className="font-medium text-sm">If you have any allergies or dietary restrictions, please let us know.</p>
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
                        className="font-medium text-textSub h-28"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Message to the host</h3>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="bg-white px-4 py-3">
                    <Textarea
                      placeholder="Enter your message"
                      {...field}
                      className="font-medium text-textSub h-28"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.email === undefined && form.getValues('email') && (
            <div className="space-y-2">
              <span>I agree with the Terms and Conditions.</span>
            </div>
          )}
          <Button type="submit" className="w-full rounded-[40px] py-8 text-lg">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default GuestInformationForm
