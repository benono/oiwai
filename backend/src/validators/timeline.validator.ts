import { z } from "zod";

const timelineSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    startTime: z.string().datetime("Invalid start time"),
    endTime: z.string().datetime("Invalid end time"),
  })
  .refine(
    (data) => {
      return new Date(data.startTime) < new Date(data.endTime);
    },
    {
      message: "End time must be after start time",
    },
  );

const createTimelinesSchema = z.object({
  timelines: z
    .array(timelineSchema)
    .min(1, "At least one timeline is required")
    .refine(
      (timelines) => {
        // Check if timelines are sorted by start time
        return timelines.every((timeline, index) => {
          if (index === 0) return true;
          return (
            new Date(timelines[index - 1].startTime) <=
            new Date(timeline.startTime)
          );
        });
      },
      {
        message: "Timelines must be sorted by start time",
      },
    )
    .refine(
      (timelines) => {
        // Check for overlaps
        for (let i = 0; i < timelines.length - 1; i++) {
          const current = new Date(timelines[i].endTime);
          const nextStart = new Date(timelines[i + 1].startTime);
          if (current > nextStart) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Timelines cannot overlap",
      },
    ),
});

export const validateCreateTimelines = (data: unknown) => {
  return createTimelinesSchema.parse(data);
};
