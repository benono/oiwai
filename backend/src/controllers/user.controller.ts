import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import usersModel from "../models/user.model";
import { EmailService } from "../utils/email";

const getUserById = async (req: Request, res: Response) => {
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
  res.status(200).json({ user });
};

const emailTest = async (req: Request, res: Response) => {
  try {
    const emailService = new EmailService();
    await emailService.sendGuestAttending({
      to: "bentoki.1213@gmail.com",
      eventName: "Event Name",
      eventDate: "2025-12-20",
      inviterName: "Inviter Name",
      eventId: "eventId",
      eventImage: "eventImage",
      eventLocation: "Tokyo",
    });
    await emailService.sendOneDayBeforeReminder({
      to: "bentoki.1213@gmail.com",
      eventName: "Event Name",
      eventDate: "2025-12-20",
      eventLocation: "Tokyo",
      eventId: "eventId",
      eventImage: "eventImage",
    });
    await emailService.sendDayOfReminder({
      to: "bentoki.1213@gmail.com",
      eventName: "Event Name",
      eventDate: "2025-12-20",
      eventLocation: "Tokyo",
      eventId: "eventId",
      eventImage: "eventImage",
      eventStartTime: "4:00 PM",
    });
    await emailService.sendAfterEvent({
      to: "bentoki.1213@gmail.com",
      eventName: "Event Name",
      eventId: "eventId",
    });
    await emailService.sendAnnouncement({
      to: "bentoki.1213@gmail.com",
      eventName: "Event Name",
      inviterName: "Inviter Name",
      eventDate: "Event Date",
      eventLocation: "Event Location",
      eventId: "Event Id",
      eventImage: "Event Image",
      inviterImage: "Inviter Image",
      announcement:
        "Hi, everyone! The event is coming tomorrow. Can't wait to see you all :) ",
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get user by id" });
  }
};

export default {
  getUserById,
};
