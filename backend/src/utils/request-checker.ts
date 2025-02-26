import { clerkClient, getAuth } from "@clerk/express";
import { Request } from "express";
import { NotFoundError, UnauthorizedError, ValidationError } from "../errors";
import userModel from "../models/user.model";
import eventParticipantsModel from "../models/eventParticipants.model";

export const checkIsRequestFromHost = async (
  req: Request<{ event_id: string }>,
): Promise<boolean> => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new UnauthorizedError();
  }
  const eventId = Number(req.params.event_id);
  if (isNaN(eventId)) {
    throw new ValidationError("Invalid event ID");
  }
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    throw new NotFoundError("User");
  }
  return await userModel.checkIsEventHost(
    user.emailAddresses[0].emailAddress,
    eventId,
  );
};

export const checkIsRequestFromParticipant = async (
  req: Request<{ event_id: string }>,
): Promise<boolean> => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new UnauthorizedError();
  }
  const eventId = Number(req.params.event_id);
  if (isNaN(eventId)) {
    throw new ValidationError("Invalid event ID");
  }
  return await eventParticipantsModel.checkIsEventParticipant(userId, eventId);
};
