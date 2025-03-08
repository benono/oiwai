import { renderAsync } from "@react-email/render";
import { Resend } from "resend";
import { AfterEvent } from "./emails/templates/after-event";
import { Announcement } from "./emails/templates/announcement";
import { DayOfReminder } from "./emails/templates/day-of-reminder";
import { GuestAttending } from "./emails/templates/guest-attending";
import { OneDayBeforeReminder } from "./emails/templates/one-day-before-reminder";

export class EmailService {
  private resend: Resend;
  private from: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = "oiwai@resend.dev";
  }

  async sendGuestAttending({
    eventName,
    eventDate,
    eventLocation,
    eventId,
    eventImage,
  }: {
    eventName: string;
    eventDate: string;
    eventLocation: string;
    inviterName: string;
    eventId: string;
    eventImage: string;
  }) {
    try {
      const html = await renderAsync(
        GuestAttending({
          eventName,
          eventDate,
          eventLocation,
          eventId,
          eventImage,
        }),
      );
      return await this.resend.emails.send({
        from: this.from,
        to: "memimei0306@gmail.com",
        subject: `You're in! ${eventName} details inside 🚀`,
        html,
      });
    } catch (error) {
      console.error("Failed to send guest attending mail:", error);
      throw error;
    }
  }

  async sendOneDayBeforeReminder({
    eventName,
    eventDate,
    eventId,
    eventImage,
    eventLocation,
  }: {
    eventName: string;
    eventDate: string;
    eventId: string;
    eventImage: string;
    eventLocation: string;
  }) {
    try {
      const html = await renderAsync(
        OneDayBeforeReminder({
          eventName,
          eventDate,
          eventLocation,
          eventId,
          eventImage,
          reminderDate: "1 day",
        }),
      );
      return await this.resend.emails.send({
        from: this.from,
        to: "memimei0306@gmail.com",
        subject: `Reminder for ${eventName}! (1 day before)`,
        html,
      });
    } catch (error) {
      console.error("Failed to send one day before reminder mail:", error);
      throw error;
    }
  }

  async sendDayOfReminder({
    eventName,
    eventDate,
    eventId,
    eventImage,
    eventLocation,
    eventStartTime,
  }: {
    eventName: string;
    eventDate: string;
    eventId: string;
    eventImage: string;
    eventLocation: string;
    eventStartTime: string;
  }) {
    try {
      const html = await renderAsync(
        DayOfReminder({
          eventName,
          eventDate,
          eventLocation,
          eventId,
          eventImage,
          eventStartTime,
        }),
      );
      return await this.resend.emails.send({
        from: this.from,
        to: "memimei0306@gmail.com",
        subject: `Reminder for ${eventName}! (Today)`,
        html,
      });
    } catch (error) {
      console.error("Failed to send day of reminder mail:", error);
      throw error;
    }
  }

  async sendAfterEvent({
    eventName,
    eventId,
  }: {
    eventName: string;
    eventId: string;
  }) {
    try {
      const html = await renderAsync(
        AfterEvent({
          eventName,
          eventId,
        }),
      );
      return await this.resend.emails.send({
        from: this.from,
        to: "memimei0306@gmail.com",
        subject: `✨ Thanks for joining ${eventName}! ✨`,
        html,
      });
    } catch (error) {
      console.error("Failed to after event mail:", error);
      throw error;
    }
  }

  async sendAnnouncement({
    eventName,
    inviterName,
    eventDate,
    eventLocation,
    eventId,
    eventImage,
    inviterImage,
    announcement,
  }: {
    eventName: string;
    inviterName: string;
    eventDate: string;
    eventLocation: string;
    eventId: string;
    eventImage: string;
    inviterImage: string;
    announcement: string;
  }) {
    try {
      const html = await renderAsync(
        Announcement({
          eventName,
          inviterName,
          eventDate,
          eventLocation,
          eventId,
          eventImage,
          inviterImage,
          announcement,
        }),
      );
      return await this.resend.emails.send({
        from: this.from,
        to: "memimei0306@gmail.com",
        subject: `【${eventName}】New Message from the host 📣`,
        html,
      });
    } catch (error) {
      console.error("Failed to announcement mail:", error);
      throw error;
    }
  }
}
