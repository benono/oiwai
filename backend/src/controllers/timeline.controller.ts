import { Request, Response } from "express";
import { z } from "zod";
import timelineModel from "../models/timeline.model";
import { validateCreateTimelines } from "../validators/timeline.validator";

// Get event timelines
const getEventTimelines = async (
  req: Request<{ event_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const timelines = await timelineModel.fetchTimelinesByEventId(eventId);
    res.status(200).json({ data: { timelines } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get timeline by id" });
  }
};

// Create new timeline(s)
const createTimelines = async (
  req: Request<{ event_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const validatedData = validateCreateTimelines(req.body);

    try {
      const createdTimelines = await timelineModel.createTimelines(
        eventId,
        validatedData.timelines.map((timeline) => ({
          ...timeline,
          startTime: new Date(timeline.startTime),
          endTime: new Date(timeline.endTime),
        })),
      );
      res.status(200).json({ data: { timelines: createdTimelines } });
    } catch (error) {
      if (error instanceof Error && error.message === "Timeline overlaps with existing timelines") {
        return res.status(400).json({
          error: "Validation failed",
          details: [{ message: "New timelines overlap with existing timelines" }],
        });
      }
      throw error;
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }
    console.error(err);
    res.status(500).json({ error: "Unable to create timeline" });
  }
};

const createTimeline = async (
  req: Request<{ event_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    //const validatedData = validateCreateTimelines(req.body);
    const {timeline} = req.body;
    const createdTimeline = await timelineModel.createTimelines(
      eventId,
      [timeline],
    );
    res.status(200).json({ data: { timeline: createdTimeline } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create timeline" });
  }
};

// Update timeline
const updateTimeline = async (
  req: Request<{ timeline_id: string }>,
  res: Response,
) => {
  try {
    const timelineId = Number(req.params.timeline_id);
    const { timeline } = req.body;
    const updatedTimeline = await timelineModel.updateTimeline(
      timelineId,
      timeline,
    );
    res.status(200).json({ updatedTimeline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update timeline" });
  }
};

// Delete timeline
const deleteTimeline = async (
  req: Request<{ timeline_id: string }>,
  res: Response,
) => {
  try {
    const timelineId = Number(req.params.timeline_id);
    await timelineModel.deleteTimeline(timelineId);
    res.status(200).json({ message: "Timeline deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete timeline" });
  }
};

export default {
  getEventTimelines,
  createTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
};
