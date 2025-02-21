import { Request, Response } from "express";
import { getAuth, EmailAddress } from "@clerk/express";
import usersModel from "../models/user.model";

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const courses = await usersModel.fetchAllUsers()
    res.status(200).json(courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to get all users' })
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
    const user = await usersModel.fetchUSerById(id)
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

export default {
    getAllUsers,
    getuserById
  }