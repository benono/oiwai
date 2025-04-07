import * as React from "react";
import { BaseReminder } from "./base-reminder";

const URL = process.env.BASE_URL;

interface OneDayBeforeReminderProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
  eventImage: string;
  reminderDate: string;
}

export const OneDayBeforeReminder = ({
  eventName,
  eventDate,
  eventLocation,
  eventId,
  eventImage,
  reminderDate
}: OneDayBeforeReminderProps) => {
  return (
    <BaseReminder
      eventName={eventName}
      eventDate={eventDate}
      eventLocation={eventLocation}
      eventId={eventId}
      eventImage={eventImage}
      reminderDate={reminderDate}
    />
  );
};
