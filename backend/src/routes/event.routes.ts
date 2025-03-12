import { Router } from "express";
import albumController from "../controllers/album.controller";
import eventController from "../controllers/event.controller";
import eventParticipantsController from "../controllers/eventParticipants.controller";
import necessitiesModel from "../controllers/necessities.controller";
import participantNecessitiesModel from "../controllers/participantNecessities.controller";
import timelineController from "../controllers/timeline.controller";
import thingsToBuyController from "../controllers/tningsToBuy.controller";
import requireAuthMiddleware from "../middleware/auth";
import {
  isEventHost,
  isEventHostOrParticipant,
} from "../middleware/event.auth";
import upload from "../middleware/uploadMiddleware";
const eventRouter = Router();

// Routes
eventRouter.post(
  "/",
  requireAuthMiddleware,
  upload.single("thumbnail"),
  eventController.createNewEvent,
);
eventRouter.get(
  "/:event_id",
  isEventHostOrParticipant,
  eventController.getEventById,
);
eventRouter.get(
  "/:event_id/is-host",
  isEventHostOrParticipant,
  eventController.checkIsEventHost,
);

eventRouter.get(
  "/:event_id/necessities",
  requireAuthMiddleware,
  necessitiesModel.getNecessities,
);

eventRouter.post(
  "/:event_id/necessities",
  requireAuthMiddleware,
  necessitiesModel.addNewNecessitiesInfo,
);

eventRouter.patch(
  "/:event_id/necessities",
  requireAuthMiddleware,
  necessitiesModel.updateNecessitiesInfo,
);

eventRouter.get(
  "/:event_id/me/necessities",
  requireAuthMiddleware,
  participantNecessitiesModel.getParticipantNecessities,
);

eventRouter.patch(
  "/:event_id/me/necessities/:necessity_id",
  requireAuthMiddleware,
  participantNecessitiesModel.updateParticipantNecessities,
);

// Timelines
eventRouter.get(
  "/:event_id/timelines",
  isEventHostOrParticipant,
  timelineController.getEventTimelines,
);
eventRouter.post(
  "/:event_id/timelines",
  isEventHost,
  upload.single("profileImage"),
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
eventRouter.get(
  "/:event_id/who-is-coming",
  isEventHostOrParticipant,
  eventParticipantsController.getWhoIsComing,
);

eventRouter.get(
  "/:event_id/participants",
  isEventHost,
  eventParticipantsController.getEventParticipants,
);
eventRouter.patch(
  "/:event_id/participants/:participant_id/attendance",
  isEventHost,
  eventParticipantsController.updateParticipantAttendance,
);
eventRouter.delete(
  "/:event_id/participants/:participant_id",
  isEventHost,
  eventParticipantsController.deleteParticipant,
);
eventRouter.post(
  "/:event_id/participants/temporary",
  isEventHost,
  eventParticipantsController.addTemporaryParticipant,
);
eventRouter.patch(
  "/:event_id/participants/temporary/:participant_id/attendance",
  isEventHost,
  eventParticipantsController.updateTemporaryParticipantAttendance,
);
eventRouter.delete(
  "/:event_id/participants/temporary/:participant_id",
  isEventHost,
  eventParticipantsController.deleteTemporaryParticipant,
);

//Things to buy
eventRouter.get(
  "/:event_id/things-to-buy",
  isEventHost,
  thingsToBuyController.getThingsToBuyItems,
);

eventRouter.get(
  "/:event_id/things-to-buy/budget",
  isEventHost,
  thingsToBuyController.getThingsToBuyBudget,
);

eventRouter.get(
  "/:event_id/things-to-buy/:item_id",
  isEventHost,
  thingsToBuyController.getThingsToBuyItem,
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

//Album
eventRouter.get(
  "/:event_id/album",
  isEventHostOrParticipant,
  albumController.getAlbumPictures,
);
eventRouter.post(
  "/:event_id/album",
  isEventHostOrParticipant,
  upload.array("pictures", 20),
  albumController.uploadAlbumPictures,
);
eventRouter.delete(
  "/:event_id/album",
  isEventHostOrParticipant,
  albumController.deleteAlbumPictures,
);
export default eventRouter;
