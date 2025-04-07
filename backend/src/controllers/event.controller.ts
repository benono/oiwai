import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../errors";
import eventModel from "../models/event.model";
import Event from "../types/event";
import MulterFile from "../types/multerfile";
import uploadImage from "../utils/cloudinary.util";
import { checkIsRequestFromHost } from "../utils/request-checker";
import { getAuth, clerkClient } from "@clerk/express";
import userModel from "../models/user.model";

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
    const createdEvent = req.body;
    const file = req.file as MulterFile;
    delete createdEvent.thumbnail;

    if (
      createdEvent.latitude == null ||
      createdEvent.longitude == null ||
      createdEvent.latitude === "" ||
      createdEvent.longitude === "" ||
      isNaN(Number(createdEvent.latitude)) ||
      isNaN(Number(createdEvent.longitude))
    ) {
      throw new ValidationError("Invalid latitude or longitude");
    }

    createdEvent.latitude = Number(createdEvent.latitude);
    createdEvent.longitude = Number(createdEvent.longitude);

    let isAskRestrictions: Boolean = false;
    if (createdEvent.isAskRestrictions === "true") {
      isAskRestrictions = true;
    }
    createdEvent.isAskRestrictions = isAskRestrictions;

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
    createdEvent.hostId = user.id;
    createdEvent.noteForNecessities = "";
    createdEvent.noteForThingsToBuy = "";
    createdEvent.budget = 0;

    let newThumbnailUrl = defaultThumbnailImage;
    if (file) {
      const thumbnail = await uploadImage.uploadImage(file.buffer, "thumbnail");
      newThumbnailUrl = thumbnail.url;
    }
    createdEvent.thumbnailUrl = newThumbnailUrl;

    const creates: Omit<Event, "id"> = createdEvent;

    const event = await eventModel.createEvent({
      ...creates,
    });

    res.status(200).json({
      success: true,
      message: "created event successfully!",
      data: { event },
    });
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
