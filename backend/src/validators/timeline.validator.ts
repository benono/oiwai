import { z } from "zod";
import { ValidationError } from "../errors/validation.error";

const timelineSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters"),
  startTime: z.string()
    .datetime("Invalid start time format")
    .transform((str) => new Date(str)),
  endTime: z.string()
    .datetime("Invalid end time format")
    .transform((str) => new Date(str)),
}).refine(
  data => data.startTime < data.endTime,
  { message: "Start time must be before end time" }
).refine(
  data => {
    const hoursDiff = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  },
  { message: "Timeline duration cannot exceed 24 hours" }
);

export const validateTimeline = (data: unknown) => {
  try {
    return timelineSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
};
