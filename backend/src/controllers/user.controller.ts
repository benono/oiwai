import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import multer from "multer";
import usersModel from "../models/user.model";
import {
  default as UserFamilies,
  default as userFamiliesModel,
} from "../models/userFamilies.model";
import { MulterFile } from "../types/multerfile";
import uploadImage from "../utils/cloudinary.util";

const prisma = new PrismaClient();

const getuserById = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get user by id" });
  }
};

const getEventInfoByEmail = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const events = await usersModel.getEventInfoByEmail(loginEmail);

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get events by email" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    prisma.$transaction(async (tx) => {
      const newName = req.body.name;
      const is_remove_image = req.body.remove_image;
      const file = req.file as MulterFile;

      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const loginUser = await clerkClient.users.getUser(userId);
      const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

      const user = await usersModel.fetchUSerByEmail(loginEmail);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (!file && !newName && !is_remove_image) {
        return res.status(400).json({ error: "request has no info" });
      }

      const storage = multer.memoryStorage();
      const upload = multer({ storage });

      console.log(file);
      let newProfileImageUrl = "";
      if (file) {
        newProfileImageUrl = await uploadImage.uploadImage(
          file.buffer,
          "profiles",
        );
      }

      let updates: Record<string, any> = {};

      updates.name = newName;
      if (is_remove_image || file) updates.profileImageUrl = newProfileImageUrl;

      const updatedUser = await usersModel.updateUser(tx, user.id, updates);
      console.log(updatedUser);

      res.status(200).json({
        success: true,
        message: "user updated sccessfully!",
        user: updatedUser,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "faild to update user" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const loginUser = await clerkClient.users.getUser(userId);
    const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

    const user = await usersModel.fetchUSerByEmail(loginEmail);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await usersModel.deleteUser(user.id);

    res.status(200).json({
      success: true,
      message: "user deleted sccessfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "faild to delete user" });
  }
};

const addNewUserFamily = async (req: Request, res: Response) => {
  try {
    prisma.$transaction(async (tx) => {
      const newName = req.body.name;
      const file = req.file as MulterFile;

      const { userId } = getAuth(req);
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const loginUser = await clerkClient.users.getUser(userId);
      const loginEmail = loginUser.emailAddresses[0]?.emailAddress;

      const user = await usersModel.fetchUSerByEmail(loginEmail);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      console.log(file);
      let newProfileImageUrl = "";
      if (file) {
        newProfileImageUrl = await uploadImage.uploadImage(
          file.buffer,
          "profiles",
        );
      }

      const familyMember = await UserFamilies.addNewUserFamily(
        tx,
        user.id,
        newName,
        newProfileImageUrl,
      );

      res.status(200).json({
        success: true,
        message: "user family  added sccessfully!",
        familyMember: familyMember,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "faild to added user" });
  }
};

const updateUserFamily = async (
  req: Request<{ family_id: string }>,
  res: Response,
) => {
  try {
    prisma.$transaction(async (tx) => {
      const familyId = Number(req.params.family_id);
      const newName = req.body.name;
      const is_remove_image = req.body.remove_image;
      const file = req.file as MulterFile;

      if (!file && !newName && !is_remove_image) {
        return res.status(400).json({ error: "request has no info" });
      }

      let newProfileImageUrl = "";
      if (file) {
        newProfileImageUrl = await uploadImage.uploadImage(
          file.buffer,
          "profiles",
        );
      }

      let updates: Record<string, any> = {};

      updates.name = newName;
      if (is_remove_image || file) updates.profileImageUrl = newProfileImageUrl;

      const updatedUser = await userFamiliesModel.updateUserFamily(
        tx,
        familyId,
        updates,
      );
      console.log(updatedUser);

      res.status(200).json({
        success: true,
        message: "user family updated sccessfully!",
        user: updatedUser,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "faild to update user family" });
  }
};

const deleteUserFamily = async (
  req: Request<{ family_id: string }>,
  res: Response,
) => {
  try {
    const familyId = Number(req.params.family_id);

    await userFamiliesModel.deleteUserFamily(familyId);

    res.status(200).json({
      success: true,
      message: "user family deleted sccessfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "faild to update user family" });
  }
};

export default {
  getuserById,
  getEventInfoByEmail,
  updateUser,
  deleteUser,
  addNewUserFamily,
  updateUserFamily,
  deleteUserFamily,
};
