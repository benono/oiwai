import { Router } from "express";
import eventController from "../controllers/event.controller";
import timelineController from "../controllers/timeline.controller";
const eventRouter = Router();

// Routes
eventRouter.get("/:event_id", eventController.getEventById);
eventRouter.get("/:event_id/timelines", timelineController.getEventTimelines);
eventRouter.post("/:event_id/timelines", timelineController.createTimeline);
eventRouter.put("/:event_id/timelines/:timeline_id", timelineController.updateTimeline);
export default eventRouter;
