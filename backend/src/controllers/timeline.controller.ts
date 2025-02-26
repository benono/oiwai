import console from "console";
import { Request, Response } from "express";
import { ValidationError } from "../errors/validation.error";
import timelineModel from "../models/timeline.model";
import { validateTimeline } from "../validators/timeline.validator";
/**
 * Get all timelines for a specific event
 * @param req Express request object with event_id parameter
 * @param res Express response object
 * @returns List of timelines for the event
 */

const getEventTimelines = async (
  req: Request<{ event_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }
    const timelines = await timelineModel.fetchTimelinesByEventId(eventId);
    res.status(200).json({ data: { timelines } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get timeline by id" });
  }
};

/**
 * Create a new timeline for a specific event
 * @param req Express request object with event_id parameter
 * @param res Express response object
 * @returns List of timelines for the event
 */

const createTimeline = async (
  req: Request<{ event_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }
    const { title, description, startTime, endTime } = req.body;
    validateTimeline({ title, description, startTime, endTime });
    const createdTimeline = await timelineModel.createTimeline(
      eventId,
      {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    );

    res.status(200).json({ success: true, data: { timeline: createdTimeline } });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: "Unable to create timeline" });
    }
  }
};

/**
 * Update a timeline for a specific event
 * @param req Express request object with timeline_id parameter
 * @param res Express response object
 * @returns List of timelines for the event
 */
const updateTimeline = async (
  req: Request<{ event_id: string; timeline_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const timelineId = Number(req.params.timeline_id);

    // Validate IDs
    if (isNaN(eventId) || isNaN(timelineId)) {
      throw new ValidationError("Invalid event or timeline ID");
    }

    const { title, description, startTime, endTime } = req.body;
    validateTimeline({ title, description, startTime, endTime });
    const updatedTimeline = await timelineModel.updateTimeline(
      eventId,
      timelineId,
      {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    );
    res
      .status(200)
      .json({ success: true, data: { timeline: updatedTimeline } });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: "Unable to update timeline" });
    }
  }
};

// Delete timeline
const deleteTimeline = async (
  req: Request<{ event_id: string; timeline_id: string }>,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const timelineId = Number(req.params.timeline_id);

    // Validate IDs
    if (isNaN(eventId) || isNaN(timelineId)) {
      throw new ValidationError("Invalid event or timeline ID");
    }

    await timelineModel.deleteTimeline(eventId, timelineId);
    res.status(200).json({
      success: true,
      message: "Timeline deleted successfully"
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: err.message
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Unable to delete timeline"
      });
    }
  }
};

export default {
  getEventTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
};
