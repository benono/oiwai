import { Router } from "express";
import usersController from "../controllers/user.controller";
import requireAuthMiddleware from "../middleware/auth";

const usersRouter = Router();

// Routes
usersRouter.get("/", requireAuthMiddleware, usersController.getuserById);
usersRouter.get(
  "/events",
  requireAuthMiddleware,
  usersController.getEventInfoByEmail,
);
usersRouter.patch("/", requireAuthMiddleware, usersController.updateUser);
usersRouter.delete("/", requireAuthMiddleware, usersController.deleteUser);
usersRouter.post(
  "/family",
  requireAuthMiddleware,
  usersController.addNewUserFamily,
);

export default usersRouter;
