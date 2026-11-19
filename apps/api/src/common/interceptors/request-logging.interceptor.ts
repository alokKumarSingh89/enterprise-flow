import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { finalize, type Observable } from "rxjs";
import { RequestWithId } from "../middleware/request-id.middleware.js";
import { Response } from "express";

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const http = context.switchToHttp();

    const request = http.getRequest<RequestWithId>();

    const response = http.getResponse<Response>();

    const startedAt = process.hrtime.bigint();

    this.logger.log(
      JSON.stringify({
        event: "http.request.started",
        requestId: request.requestId,
        method: request.method,
        path: request.path,
      }),
    );

    return next.handle().pipe(
      finalize(() => {
        const durationMs =
          Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        this.logger.log(
          JSON.stringify({
            event: "http.request.completed",
            requestId: request.requestId,
            method: request.method,
            path: request.path,
            statusCode: response.statusCode,
            durationMs: Math.round(durationMs * 100) / 100,
          }),
        );
      }),
    );
  }
}
