import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors/validation.error";
import eventParticipantsModel from "../models/eventParticipants.model";

const getEventParticipants = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const { acceptedParticipants, declinedParticipants, tempParticipants } =
      await eventParticipantsModel.getEventParticipants(eventId);
    // TODO use checkIsRequestFromHost
    //const isHost = await checkIsRequestFromHost(req);
    const isHost = true;
    // if guests
    let response = {};
    if (!isHost) {
      response = {
        whoIsComing: acceptedParticipants.map((participant) => ({
          id: participant.id,
          name: participant.name,
          profileImageUrl: participant.profileImageUrl,
        })),
      };
      res.status(200).json({ success: true, data: response });
      return;
    }
    // if host
    response = {
      acceptedParticipants,
      declinedParticipants,
      tempParticipants,
    };
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
};

export default {
  getEventParticipants,
};
