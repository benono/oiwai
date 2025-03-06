import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../errors";
import eventModel from "../models/event.model";
import userModel from "../models/user.model";
import Event from "../types/event";
import MulterFile from "../types/multerfile";
import uploadImage from "../utils/cloudinary.util";
import { checkIsRequestFromHost } from "../utils/request-checker";

const defaultThumbnailImage = process.env.DEFAULT_THUMBNAIL_IMAGE || "";

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
    const file = req.file as MulterFile;

    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await userModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      throw new NotFoundError("User");
    }

    createdEvent.startTime = new Date(createdEvent.startTime);
    createdEvent.endTime = new Date(createdEvent.endTime);

    const creates: Partial<Event> = createdEvent;
    creates.hostId = user.id;
    creates.noteForNecessities = "";
    creates.noteForThingsToBuy = "";
    creates.budget = 0;

    if (file) {
      const thumbnail = await uploadImage.uploadImage(file.buffer, "thumbnail");
      creates.thumbnailUrl = thumbnail;
    }

    res.status(200).json({});
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
