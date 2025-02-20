import { Router } from "express";
import requireAuthMiddleware from '../middleware/auth';
import rsvpController from "../controllers/rsvp.controller";

const rsvpRouter = Router()

// Routes
rsvpRouter.get('/events/:event_id', 
    requireAuthMiddleware,
    rsvpController.getEventById)

rsvpRouter.get('/me', 
    requireAuthMiddleware,
    rsvpController.getuserById)


export default rsvpRouter