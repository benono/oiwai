interface Event {
  id: number;
  hostId: number;
  title: string;
  thumbnailUrl: string;
  startTime: Date;
  endTime: Date;
  country: string;
  postalCode: string;
  province: string;
  city: string;
  address1: string;
  address2: string;
  isAskRestrictions: boolean;
  theme: string;
  noteForThingsToBuy: string;
  noteForNecessities: string;
  budget: number;
}

export default Event;
