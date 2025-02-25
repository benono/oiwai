import { ValidationError } from "../errors/validation.error";
import Timeline from "../types/timeline";
export const validateTimeline = (data: Omit<Timeline, "id" | "eventId">) => {
  // check if title is provided
  if (!data.title) {
    throw new ValidationError("Title is required");
  }
  // check if startTime is before endTime
  if (data.startTime > data.endTime) {
    throw new ValidationError("Start time must be before end time");
  }
};
