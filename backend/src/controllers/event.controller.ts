import { Request, Response } from "express";
import eventModel from "../models/event.model";

// Get event infomation
const getEventById = async (req: Request<{ event_id: string }>, res: Response) => {
    try {
      const id = Number(req.params.event_id)
      const event = await eventModel.fetchEventById(id)
      if (!event) {
        res.status(404).json({ error: 'Event not found' })
        return
      }
      res.status(200).json({event})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to get event by id' })
    }
  }

export default {
    getEventById,
}