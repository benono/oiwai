import { clerkClient, getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors";

const prisma = new PrismaClient();

// check if the user is the host of the event
export const isEventHost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const { userId } = getAuth(req);
    if (!userId) {
      throw new UnauthorizedError();
    }
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      throw new UnauthorizedError();
    }
    const userOnApp = await prisma.users.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    if (!userOnApp) {
      throw new UnauthorizedError();
    }

    const event = await prisma.events.findFirst({
      where: {
        id: eventId,
        hostId: userOnApp.id,
      },
    });

    if (!event) {
      throw new UnauthorizedError("You are not the host of this event");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// check if the user is a participant of the event (including the host)
export const isEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const user = await prisma.users.findUnique({
      where: {
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const participant = await prisma.eventParticipants.findFirst({
      where: {
        eventId,
        userId: user.id,
        isAccepted: true,
      },
    });

    // TODO check if host is automatically added as a participant.
    const isHost = await prisma.events.findFirst({
      where: {
        id: eventId,
        hostId: user.id,
      },
    });
    if (!participant && !isHost) {
      res
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
