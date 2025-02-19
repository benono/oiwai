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
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
})

type FormValues = z.infer<typeof formSchema>;

const GuestInformationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      companionName: "",
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default GuestInformationForm
