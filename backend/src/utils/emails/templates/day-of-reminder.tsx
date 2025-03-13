import * as React from "react";
import { BaseReminder } from "./base-reminder";

const URL = process.env.BASE_URL;

interface DayOfReminderProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
  eventImage: string;
  eventStartTime: string;
}

export const DayOfReminder = ({
  eventName,
  eventDate,
  eventLocation,
  eventId,
  eventImage,
  eventStartTime,
}: DayOfReminderProps) => {
  return (
    <BaseReminder
      eventName={eventName}
      eventDate={eventDate}
      eventLocation={eventLocation}
      eventId={eventId}
      eventImage={eventImage}
      reminderDate="today"
      message={`Don't forget to bring your party spirit!
See you at ${eventStartTime}`}
    />
  );
};
