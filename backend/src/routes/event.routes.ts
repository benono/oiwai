import { Router } from "express";
import requireAuthMiddleware from '../middleware/auth';
import eventController from "../controllers/event.controller";

const eventRouter = Router()

// Routes
eventRouter.get('/:event_id', 
    requireAuthMiddleware,
    eventController.getEventById)

export default eventRouter