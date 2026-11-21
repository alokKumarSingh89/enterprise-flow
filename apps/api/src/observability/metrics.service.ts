import { Injectable, OnModuleDestroy } from "@nestjs/common";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from "prom-client";

@Injectable()
export class MetricsService implements OnModuleDestroy {
  private readonly registry = new Registry();
  private readonly requestCounter: Counter<"method" | "route" | "status_code">;
  private readonly requestDuration: Histogram<
    "method" | "route" | "status_code"
  >;

  constructor() {
    this.registry.setDefaultLabels({
      service: "enterprise-flow-api",
    });

    collectDefaultMetrics({
      register: this.registry,
      prefix: "enterprise_flow_",
    });

    this.requestCounter = new Counter({
      name: "enterprise_flow_http_requests_total",
      help: "Total HTTP requests handled",
      labelNames: ["method", "route", "status_code"] as const,
      registers: [this.registry],
    });

    this.requestDuration = new Histogram({
      name: "enterprise_flow_http_request_duration_seconds",
      help: "HTTP request duration in seconds",
      labelNames: ["method", "route", "status_code"] as const,
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });
  }

  recordRequest(
    method: string,
    route: string,
    statusCode: number,
    durationSeconds: number,
  ): void {
    const labels = {
      method,
      route,
      status_code: String(statusCode),
    };

    this.requestCounter.inc(labels);
    this.requestDuration.observe(labels, durationSeconds);
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  onModuleDestroy(): void {
    this.registry.clear();
  }
}
