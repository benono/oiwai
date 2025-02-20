import { Router } from "express";
import usersController from "../controllers/user.controller";

const usersRouter = Router()

// Routes
usersRouter.get('/health', usersController.getAllUsers)

export default usersRouter