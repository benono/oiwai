interface Event {
  id: number;
  hostId: number;
  title: string;
  thumbnailUrl: string;
  startTime: Date;
  endTime: Date;
  address: string;
  latitude: number;
  longitude: number;
  isAskRestrictions: boolean;
  theme: string;
  noteForThingsToBuy: string;
  noteForNecessities: string;
  budget: number;
}

export default Event;
