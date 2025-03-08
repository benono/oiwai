import { Request, Response } from "express";
import { EmailService } from "../utils/email";

const getuserById = async (req: Request, res: Response) => {
  try {
    const emailService = new EmailService();
    await emailService.sendGuestAttending({
      eventName: "Event Name",
      eventDate: "2025-12-20",
      inviterName: "Inviter Name",
      eventId: "eventId",
      eventImage: "eventImage",
      eventLocation: "Tokyo",
    });
    await emailService.sendOneDayBeforeReminder({
      eventName: "Event Name",
      eventDate: "2025-12-20",
      eventLocation: "Tokyo",
      eventId: "eventId",
      eventImage: "eventImage",
    });
    await emailService.sendDayOfReminder({
      eventName: "Event Name",
      eventDate: "2025-12-20",
      eventLocation: "Tokyo",
      eventId: "eventId",
      eventImage: "eventImage",
      eventStartTime: "4:00 PM",
    });
    await emailService.sendAfterEvent({
      eventName: "Event Name",
      eventId: "eventId",
    });
    await emailService.sendAnnouncement({
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
  getuserById,
};
