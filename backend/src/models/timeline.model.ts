import { PrismaClient, Timelines } from "@prisma/client";
import Timeline from "../types/timeline";

const prisma = new PrismaClient();

// Fetch all timelines for an event
const fetchTimelinesByEventId = async (
  eventId: number,
): Promise<Omit<Timelines, "eventId">[]> => {
  const timelines = await prisma.timelines.findMany({
    where: { eventId },
    orderBy: [{ startTime: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
    },
  });
  return timelines;
};

// Create new timeline(s)
const createTimelines = async (
  eventId: number,
  timelineInputs: Omit<Timeline, "id" | "eventId">[],
): Promise<Timelines[]> => {
  console.log(`timelineInputs: ${JSON.stringify(timelineInputs)}`);
  console.log(`startTime: ${timelineInputs[0].startTime}`);
  console.log(`endTime: ${timelineInputs[0].endTime}`);
  console.log(`startTime: ${new Date(timelineInputs[0].startTime)}`);
  console.log(`endTime: ${new Date(timelineInputs[0].endTime)}`);
  // duplicate check
  const hasOverlap = await checkTimelineOverlap(
    eventId,
    timelineInputs.map(t => ({
      startTime: new Date(t.startTime),
      endTime: new Date(t.endTime),
    }))
  );

  if (hasOverlap) {
    throw new Error("Timeline overlaps with existing timelines");
  }

  // If no overlap, create timelines
  // const createdTimelines = await prisma.$transaction(
  //   timelineInputs.map((input) =>
  //     prisma.timelines.create({
  //       data: {
  //         ...input,
  //         eventId,
  //       },
  //     }),
  //   ),
  // );

  const dummyTimelines = timelineInputs.map((input) => ({
    ...input,
    id: 1,
    eventId: 1,
  }));
  return Promise.resolve(dummyTimelines);
  //return createdTimelines;
};

// Update timeline
const updateTimeline = async (
  id: number,
  data: Omit<Timeline, "id">,
): Promise<Timelines> => {
  const updatedTimeline = await prisma.timelines.update({
    where: { id },
    data,
  });
  return updatedTimeline;
};

// Delete timeline
const deleteTimeline = async (id: number): Promise<void> => {
  await prisma.timelines.delete({
    where: { id },
  });
};

// Validate timeline time range
const validateTimeRange = (startTime: Date, endTime: Date): boolean => {
  return startTime < endTime;
};

const checkTimelineOverlap = async (
  eventId: number,
  newTimelines: { startTime: Date; endTime: Date }[],
): Promise<boolean> => {
  // Fetch existing timelines
  const existingTimelines = await prisma.timelines.findMany({
    where: { eventId },
    select: { startTime: true, endTime: true },
  });

  // Combine new and existing timelines
  const allTimelines = [
    ...existingTimelines,
    ...newTimelines,
  ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  console.log(allTimelines);

  // Check for overlaps
  for (let i = 0; i < allTimelines.length - 1; i++) {
    const current = allTimelines[i];
    const next = allTimelines[i + 1];
    if (current.endTime > next.startTime) {
      return true; // Overlap found
    }
  }

  return false; // No overlap
};

export default {
  createTimelines,
  deleteTimeline,
  fetchTimelinesByEventId,
  updateTimeline,
  validateTimeRange,
};
