import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors";
import { venueSuggestionService } from "../services/venue-suggestion.service";

const getVenueSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      activity_type, // "Picnic", "Hiking", "Mini golf", "Tennis"
      latitude,
      longitude,
      radius = 10000, // default 10km
    } = req.body;

    if (!activity_type || !latitude || !longitude) {
      throw new ValidationError(
        "Missing required parameters: activity_type, latitude, longitude",
      );
    }

    console.log("Calling venue suggestion service with params:", {
      activityType: activity_type,
      location: { lat: latitude, lng: longitude },
      radius,
      limit: 3,
    });

    const suggestions = await venueSuggestionService.getSuggestions({
      activityType: activity_type,
      location: { lat: latitude, lng: longitude },
      radius,
      limit: 3,
    });

    console.log("Received suggestions:", suggestions);

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Error in venue suggestions:", error);
    next(error);
  }
};

export default {
  getVenueSuggestions,
};
