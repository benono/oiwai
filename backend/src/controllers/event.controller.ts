import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors";
import eventModel from "../models/event.model";
import { checkIsRequestFromHost } from "../utils/request-checker";

// Get event infomation
const getEventById = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.event_id);
    // Validate IDs
    if (isNaN(id)) {
      throw new ValidationError("Invalid event ID");
    }

    const event = await eventModel.fetchEventById(id);

    res.status(200).json({ event });
  } catch (err) {
    next(err);
  }
};

const createNewEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const createdEvent = req.body.event;

    createdEvent.startTime = new Date(createdEvent.startTime);
    createdEvent.endTime = new Date(createdEvent.endTime);

    const creates: Partial<Event> = createdEvent;

    const id = Number(req.params.event_id);
    const event = await eventModel.fetchEventById(id);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.status(200).json({ event });
  } catch (err) {
    next(err);
  }
};

const checkIsEventHost = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isHost = await checkIsRequestFromHost(req);
    res.status(200).json({ isHost });
  } catch (err) {
    next(err);
  }
};

export default {
  getEventById,
  createNewEvent,
  checkIsEventHost,
};
