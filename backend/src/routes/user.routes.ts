import { Router } from "express";
import requireAuthMiddleware from '../middleware/auth';
import usersController from "../controllers/user.controller";

const usersRouter = Router()

// Routes
usersRouter.get('/health', usersController.getAllUsers)
usersRouter.get('/me', requireAuthMiddleware, usersController.getuserById)


export default usersRouter