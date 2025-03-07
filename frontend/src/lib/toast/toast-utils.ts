import { useToast } from "@/hooks/use-toast";

// Error
export const showErrorToast = (
  toast: ReturnType<typeof useToast>["toast"],
  error: unknown,
  message: string = "An error occurred",
) => {
  if (error instanceof Error) {
    toast({
      variant: "destructive",
      title: error.message ?? "Error",
      description: message,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Unknown Error",
      description: "An unexpected error occurred.",
    });
  }
};
