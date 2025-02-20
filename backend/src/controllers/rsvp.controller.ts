import { getAuth, EmailAddress } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import rsvpModel from "../models/rsvp.model";
import RsvpForm from "../types/rsvpform";


// Get all users
const getEventById = async (req: Request<{ event_id: string }>, res: Response) => {
    try {
      const id = Number(req.params.event_id)
      const event = await rsvpModel.fetchEventById(id)
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

  const getuserById = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
          res.status(401).json({ error: "Unauthorized" });
          return;
        }
        const id = Number(userId);
      const user = await rsvpModel.fetchUSerById(id)
      if (!user) {
        res.status(404).json({ error: 'Event not found' })
        return
      }
      res.status(200).json({user})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to get user by id' })
    }
  }

  const submitRsvpForm = async (req: Request<{}, {}, RsvpForm>, res: Response) => {
    try {
        const emai = req.body.guest.email
        const { userId } = getAuth(req);

        if (!userId) {
            //not logged in
            const userByEmail = await rsvpModel.fetchUSerByEmail
            if(userByEmail.length){
                res.status(400).json({ error: 'this email is already used.' })
                return
            }

        }else{
            //logged in
            const loginUser = await clerkClient.users.getUser(userId);
            const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

            if(emai!==loginEmail){
                res.status(400).json({ error: 'Email is different.' })
                return 
            }


        }

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to get event by id' })
    }
  }

export default {
    getEventById,
    getuserById,
    submitRsvpForm
  }