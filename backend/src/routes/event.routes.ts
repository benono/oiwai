import { Router } from "express";
import eventController from "../controllers/event.controller";
import eventParticipantsController from "../controllers/eventParticipants.controller";
import timelineController from "../controllers/timeline.controller";
import thingsToBuyController from "../controllers/tningsToBuy.controller";
import { isEventHost, isEventParticipant } from "../middleware/event.auth";
const eventRouter = Router();

// Routes
eventRouter.get("/:event_id", eventController.getEventById);

// Timelines
eventRouter.get(
  "/:event_id/timelines",
  isEventParticipant,
  timelineController.getEventTimelines,
);
eventRouter.post(
  "/:event_id/timelines",
  isEventHost,
  timelineController.createTimeline,
);
eventRouter.put(
  "/:event_id/timelines/:timeline_id",
  isEventHost,
  timelineController.updateTimeline,
);
eventRouter.delete(
  "/:event_id/timelines/:timeline_id",
  isEventHost,
  timelineController.deleteTimeline,
);

// Participants
// TODO add middleware
eventRouter.get(
  "/:event_id/participants",
  eventParticipantsController.getEventParticipants,
);
eventRouter.patch(
  "/:event_id/participants/:participant_id/attendance",
  eventParticipantsController.updateParticipantAttendance,
);

//Things to buy
eventRouter.get(
  "/:event_id/things-to-buy",
  isEventHost,
  thingsToBuyController.getThingsToBuyItems,
);

eventRouter.post(
  "/:event_id/things-to-buy/init",
  isEventHost,
  thingsToBuyController.addThingsToBuyItemInit,
);

eventRouter.patch(
  "/:event_id/things-to-buy/budget",
  isEventHost,
  thingsToBuyController.updateBudget,
);

eventRouter.post(
  "/:event_id/things-to-buy/",
  isEventHost,
  thingsToBuyController.addThingsToBuyItem,
);

eventRouter.patch(
  "/:event_id/things-to-buy/:item_id/is-purchased",
  isEventHost,
  thingsToBuyController.updateItemPurchased,
);

eventRouter.put(
  "/:event_id/things-to-buy/:item_id",
  isEventHost,
  thingsToBuyController.updateThingsToBuy,
);

eventRouter.delete(
  "/:event_id/things-to-buy/:item_id",
  isEventHost,
  thingsToBuyController.deleteThingsToBuy,
);

export default eventRouter;
