import type { Observable } from "rxjs";

import { tap } from "rxjs/operators";

import type { Request, Response } from "express";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { MetricsService } from "./metrics.service.js";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(MetricsService)
    private readonly metrics: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const routePath = request.route?.path ?? "unmatched";
    const controllerPath = Reflect.getMetadata("path", context.getClass()) as
      | string
      | undefined;

    const route = [controllerPath, routePath].filter(Boolean).join("/");

    // Avoid measuring the metrics scrape itself.
    if (controllerPath === "internal" && routePath === "metrics") {
      return next.handle();
    }

    const startedAt = process.hrtime.bigint();

    const record = (statusCode: number): void => {
      const elapsedSeconds =
        Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;

      this.metrics.recordRequest(
        request.method,
        route || "unknown",
        statusCode,
        elapsedSeconds,
      );
    };

    return next.handle().pipe(
      tap({
        next: () => {
          record(response.statusCode);
        },
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;

          record(statusCode);
        },
      }),
    );
  }
}
