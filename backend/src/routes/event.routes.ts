import { Router } from "express";
import albumComtroller from "../controllers/album.comtroller";
import eventController from "../controllers/event.controller";
import eventParticipantsController from "../controllers/eventParticipants.controller";
import timelineController from "../controllers/timeline.controller";
import {
  isEventHost,
  isEventHostOrParticipant,
} from "../middleware/event.auth";
import upload from "../middleware/uploadMiddleware";
const eventRouter = Router();

// Routes
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
// TODO add middleware
eventRouter.get(
  "/:event_id/participants",
  eventParticipantsController.getEventParticipants,
);
eventRouter.patch(
  "/:event_id/participants/:participant_id/attendance",
  eventParticipantsController.updateParticipantAttendance,
);

//Album
eventRouter.get(
  "/:event_id/album",
  isEventHostOrParticipant,
  albumComtroller.getAlbumPictures,
);
eventRouter.post(
  "/:event_id/album",
  isEventHostOrParticipant,
  upload.array("pictures", 20),
  albumComtroller.getAlbumPictures,
);
eventRouter.delete(
  "/:event_id/album",
  isEventHostOrParticipant,
  albumComtroller.getAlbumPictures,
);
export default eventRouter;
