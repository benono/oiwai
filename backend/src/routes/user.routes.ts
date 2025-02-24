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
  upload.single("image"),
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
  upload.single("image"),
  usersController.addNewUserFamily,
);
usersRouter.patch(
  "/family/:family_id",
  requireAuthMiddleware,
  upload.single("image"),
  usersController.updateUserFamily,
);
usersRouter.delete(
  "/family/:family_id",
  requireAuthMiddleware,
  usersController.updateUserFamily,
);

export default usersRouter;
