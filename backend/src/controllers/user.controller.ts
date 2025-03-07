import { Request, Response } from "express";
import { EmailService } from "../utils/email";

const getuserById = async (req: Request, res: Response) => {
  try {
    const emailService = new EmailService();
    await emailService.sendWelcome("Event Name", "Inviter Name");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get user by id" });
  }
};

export default {
  getuserById,
};
