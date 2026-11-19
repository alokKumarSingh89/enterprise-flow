import "reflect-metadata";

import { ExecutionContext, Logger } from "@nestjs/common";

import type { CallHandler } from "@nestjs/common";

import { describe, expect, it, vi } from "vitest";

import { lastValueFrom, of } from "rxjs";

import type { Request, Response } from "express";

import { RequestIdMiddleware } from "../src/common/middleware/request-id.middleware.js";

import { RequestLoggingInterceptor } from "../src/common/interceptors/request-logging.interceptor.js";

describe("RequestIdMiddleware", () => {
  it("generates and returns a request ID", () => {
    const middleware = new RequestIdMiddleware();

    const request = {} as Request;

    const response = {
      setHeader: vi.fn(),
    } as unknown as Response;

    const next = vi.fn();

    middleware.use(request, response, next);

    expect(request).toHaveProperty("requestId");

    expect(response.setHeader).toHaveBeenCalledWith(
      "x-request-id",
      expect.any(String),
    );

    expect(next).toHaveBeenCalledOnce();
  });

  it("generates different IDs for different requests", () => {
    const middleware = new RequestIdMiddleware();

    const first = {} as Request & { requestId?: string };
    const second = {} as Request & { requestId?: string };

    const response = {
      setHeader: vi.fn(),
    } as unknown as Response;

    middleware.use(first, response, vi.fn());
    middleware.use(second, response, vi.fn());

    expect(first.requestId).not.toBe(second.requestId);
  });
});

describe("RequestLoggingInterceptor", () => {
  it("logs request start and completion", async () => {
    const logSpy = vi
      .spyOn(Logger.prototype, "log")
      .mockImplementation(() => undefined);

    try {
      const interceptor = new RequestLoggingInterceptor();

      const request = {
        requestId: "test-request-001",
        method: "GET",
        path: "/api/v1/health",
      };

      const response = {
        statusCode: 200,
      };

      const context = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => request,
          getResponse: () => response,
        }),
      } as unknown as ExecutionContext;

      const next: CallHandler = {
        handle: () => of({ status: "ok" }),
      };

      const result = await lastValueFrom(interceptor.intercept(context, next));

      expect(result).toEqual({
        status: "ok",
      });

      expect(logSpy).toHaveBeenCalledTimes(2);

      const firstLog = JSON.parse(String(logSpy.mock.calls[0]?.[0])) as {
        event: string;
      };

      const secondLog = JSON.parse(String(logSpy.mock.calls[1]?.[0])) as {
        event: string;
      };

      expect(firstLog.event).toBe("http.request.started");

      expect(secondLog.event).toBe("http.request.completed");
    } finally {
      logSpy.mockRestore();
    }
  });
});
