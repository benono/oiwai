export type EventType = {
  id: string;
  hostId: string;
  title: string;
  thumbnailUrl: string;
  startTime: Date;
  endTime: Date;
  latitude: number;
  longitude: number;
  address: string;
  isAskRestriction: boolean;
  theme: string;
  noteForNecessities: string;
  noteForThingsToBuy: string;
};

export type MyPageEventType = Pick<
  EventType,
  "id" | "title" | "thumbnailUrl" | "startTime" | "endTime"
> & {
  isHost: boolean;
};

export type MyPageEventReturnType = {
  events: MyPageEventType[];
};

export type IconType =
  | "Necessity"
  | "Timeline"
  | "Album"
  | "Talk"
  | "Buy"
  | "Guest list"
  | "RSVP";

export type CreateEventType = Omit<
  BaseEventType,
  "id" | "hostId" | "noteForNecessities" | "noteForThingsToBuy"
> & {
  thumbnail: File;
};
