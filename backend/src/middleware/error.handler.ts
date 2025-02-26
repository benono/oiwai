import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Error logging
  console.error(
    chalk.red("━━━━━━━━━━ Error ━━━━━━━━━━\n") +
      chalk.yellow(`Time: ${new Date().toISOString()}\n`) +
      chalk.yellow(`Path: ${req.method} ${req.originalUrl}\n`) +
      chalk.red(`Name: ${err.name}\n`) +
      chalk.red(`Message: ${err.message}\n`) +
      (err.stack ? chalk.gray(`Stack: ${err.stack}\n`) : "") +
      chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━\n"),
  );
  if (res.headersSent) {
    return next(err);
  }
  switch (err instanceof Error) {
    case err instanceof ValidationError:
      res.status(400).send({
        success: false,
        error: err.message,
      });
      break;
    case err instanceof UnauthorizedError:
      res.status(401).send({
        success: false,
        error: err.message,
      });
      break;
    case err instanceof NotFoundError:
      res.status(404).send({
        success: false,
        error: err.message,
      });
      break;
    case err instanceof ForbiddenError:
      res.status(403).send({
        success: false,
        error: err.message,
      });
      break;
    default:
      res.status(500).send({
        success: false,
        error: "Internal server error",
      });
      break;
  }
};
