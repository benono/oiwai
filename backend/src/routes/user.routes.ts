import { Router } from "express";
import usersController from "../controllers/user.controller";
import requireAuthMiddleware from "../middleware/auth";
import upload from "../middleware/uploadMiddleware";

const usersRouter = Router();

// Routes
usersRouter.get("/", requireAuthMiddleware, usersController.getuserById);
usersRouter.get(
  "/events",
  requireAuthMiddleware,
  usersController.getEventInfoByEmail,
);
usersRouter.patch(
  "/",
  requireAuthMiddleware,
  upload.single("profileImage"),
  usersController.updateUser,
);
usersRouter.delete("/", requireAuthMiddleware, usersController.deleteUser);
usersRouter.post(
  "/family",
  requireAuthMiddleware,
  usersController.addNewUserFamily,
);
usersRouter.post(
  "/family/",
  requireAuthMiddleware,
  upload.single("profileImage"),
  usersController.addNewUserFamily,
);

usersRouter.patch(
  "/family/:family_id",
  requireAuthMiddleware,
  upload.single("profileImage"),
  usersController.updateUserFamily,
);

usersRouter.delete(
  "/family/:family_id",
  requireAuthMiddleware,
  usersController.deleteUserFamily,
);

export default usersRouter;
