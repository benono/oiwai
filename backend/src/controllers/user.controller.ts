import { Request, Response } from "express";
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

export default {
    getAllUsers,
  }