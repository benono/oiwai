import { Router } from "express";
import eventController from "../controllers/event.controller";
import eventParticipantsController from "../controllers/eventParticipants.controller";
import timelineController from "../controllers/timeline.controller";
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
eventRouter.get(
  "/:event_id/who-is-coming",
  eventParticipantsController.getWhoIsComing,
);
eventRouter.patch(
  "/:event_id/participants/:participant_id/attendance",
  eventParticipantsController.updateParticipantAttendance,
);
eventRouter.delete(
  "/:event_id/participants/:participant_id",
  eventParticipantsController.deleteParticipant,
);
eventRouter.post(
  "/:event_id/participants/temporary",
  eventParticipantsController.addTemporaryParticipant,
);
eventRouter.delete(
  "/:event_id/participants/temporary/:participant_id",
  eventParticipantsController.deleteTemporaryParticipant,
);

export default eventRouter;
