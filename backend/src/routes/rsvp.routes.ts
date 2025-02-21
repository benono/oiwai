import { Router } from "express";
import requireAuthMiddleware from '../middleware/auth';
import rsvpController from "../controllers/rsvp.controller";

const rsvpRouter = Router()

// Routes
rsvpRouter.post('/:event_id/rsvp-form', requireAuthMiddleware,rsvpController.submitRsvpForm)


export default rsvpRouter