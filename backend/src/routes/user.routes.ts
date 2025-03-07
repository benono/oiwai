import { Router } from "express";
import usersController from "../controllers/user.controller";

const usersRouter = Router();

// Routes
usersRouter.get("/", usersController.getuserById);

export default usersRouter;
