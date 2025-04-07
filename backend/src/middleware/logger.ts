import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

const colors = {
  method: {
    GET: chalk.green,
    POST: chalk.yellow,
    PUT: chalk.blue,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
  },
  status: {
    success: chalk.green,
    error: chalk.red,
    warn: chalk.yellow,
  },
};

const filterHeaders = (
  headers: Record<string, string | string[] | undefined>,
) => {
  const importantHeaders = [
    "authorization",
    "content-type",
    "user-agent",
    "origin",
    "referer",
  ];

  return Object.entries(headers)
    .filter(([key]) => importantHeaders.includes(key.toLowerCase()))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

const formatDuration = (ms: number): string => {
  if (ms < 100) return chalk.green(`${ms}ms`);
  if (ms < 1000) return chalk.yellow(`${ms}ms`);
  return chalk.red(`${ms}ms`);
};

const getStatusColor = (status: number) => {
  if (status < 200) return colors.status.warn; // 1xx
  if (status < 300) return colors.status.success; // 2xx
  if (status < 400) return colors.status.warn; // 3xx
  return colors.status.error; // 4xx, 5xx
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  const timestamp = chalk.gray(`[${new Date().toISOString()}]`);
  const method =
    colors.method[req.method as keyof typeof colors.method] || chalk.white;

  // request
  const filteredHeaders = filterHeaders(req.headers);
  console.log(
    chalk.gray("━━━━━━━━━━ Request ━━━━━━━━━━\n") +
      `${timestamp} ${method(req.method)} ${chalk.cyan(req.url)}\n` +
      (Object.keys(filteredHeaders).length
        ? chalk.magenta("Headers:") +
          "\n" +
          chalk.cyan(JSON.stringify(filteredHeaders, null, 2)) +
          "\n"
        : "") +
      (Object.keys(req.body).length
        ? chalk.magenta("Body:") +
          "\n" +
          chalk.cyan(JSON.stringify(req.body, null, 2))
        : ""),
  );

  // response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const formattedDuration = formatDuration(duration);

    console.log(
      chalk.gray("━━━━━━━━━━ Response ━━━━━━━━━━\n") +
        statusColor(`${res.statusCode} ${res.statusMessage || ""}\n`) +
        chalk.gray("Time: ") +
        formattedDuration +
        "\n" +
        chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━\n"),
    );
  });

  next();
};
