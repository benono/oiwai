import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors";
import {
  checkIsRequestFromHost,
  checkIsRequestFromHostOrParticipant,
} from "../utils/request-checker";

// check if the user is the host of the event
export const isEventHost = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isHost = await checkIsRequestFromHost(req);
    if (!isHost) {
      throw new ForbiddenError("You are not host of this event");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// check if the user is a participant of the event (including the host)
export const isEventHostOrParticipant = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isParticipant = await checkIsRequestFromHostOrParticipant(req);
    if (!isParticipant) {
      throw new ForbiddenError("You are not participant of this event");
    }
    next();
  } catch (error) {
    next(error);
  }
};
