import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors/validation.error";
import albumModel from "../models/album.model";
import eventModel from "../models/event.model";
import usersModel from "../models/user.model";

const getAlbumPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }
    const pictures = await albumModel.fetchAlbumPictures(eventId);
    res.status(200).json({ data: { pictures } });
  } catch (err) {
    next(err);
  }
};

const uploadAlbumPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const pictures = await albumModel.addNewPicture(eventId, user.id, files);

    res.status(200).json({
      success: true,
      message: "uploaded pictures successfully!",
      data: { pictures },
    });
  } catch (err) {
    next(err);
  }
};

const deleteAlbumPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const deleteIds = req.body.pictures;

    if (!deleteIds || deleteIds.length === 0) {
      return res.status(400).json({ message: "No files to delete" });
    }

    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const event = await eventModel.fetchEventById(eventId);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    //check user is host
    const isHost = event.hostId === user.id;

    await albumModel.deletePicture(user.id, isHost, deleteIds);

    res
      .status(200)
      .json({ success: true, message: "uploaded pictures successfully!" });
  } catch (err) {
    next(err);
  }
};

export default {
  getAlbumPictures,
  uploadAlbumPictures,
  deleteAlbumPictures,
};
