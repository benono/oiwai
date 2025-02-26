export type EventType = {
  id: string;
  hostId: string;
  title: string;
  thumbnailUrl: string;
  startTime: datetime;
  endTime: datetime;
  country: string;
  postalCode: string;
  province: string;
  city: string;
  address1: string;
  address2: string;
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
