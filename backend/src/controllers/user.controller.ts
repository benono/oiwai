import { Request, Response } from "express";
import { getAuth, EmailAddress } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import usersModel from "../models/user.model";

const getuserById = async (req: Request, res: Response) => {
  try {
      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const loginUser = await clerkClient.users.getUser(userId);
      const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.status(200).json({user})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to get user by id' })
  }
}

export default {
    getuserById
  }