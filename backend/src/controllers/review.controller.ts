import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../errors";
import eventModel from "../models/event.model";
import reviewModel from "../models/review.model";

const getReviewTexts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const event = await eventModel.fetchEventById(eventId);
    if (!event) {
      throw new NotFoundError("Event");
    }

    const reviews = await reviewModel.fetchReviewTexts(eventId);

    res.status(200).json({ data: { reviews } });
  } catch (err) {
    next(err);
  }
};

const getReviewImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const event = await eventModel.fetchEventById(eventId);
    if (!event) {
      throw new NotFoundError("Event");
    }

    const reslut = await reviewModel.fetchReviewImages(eventId);
    const reviewImages = reslut
      .flatMap((obj) => Object.values(obj))
      .filter((url) => url !== "");

    res.status(200).json({ data: { reviewImages } });
  } catch (err) {
    next(err);
  }
};

export default {
  getReviewTexts,
  getReviewImages,
};
