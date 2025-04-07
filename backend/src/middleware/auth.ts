import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors";

const requireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new UnauthorizedError();
  }
  next();
};

export default requireAuthMiddleware;
