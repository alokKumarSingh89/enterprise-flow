import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
export const REQUEST_ID_HEADER = "x-request-id";

export type RequestWithId = Request & {
  requestId?: string;
};

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction): void {
    // Generate a trusted ID on the server.
    // Do not blindly trust a client-supplied ID.
    const requestId = randomUUID();

    req.requestId = requestId;

    res.setHeader(REQUEST_ID_HEADER, requestId);
    next();
  }
}
