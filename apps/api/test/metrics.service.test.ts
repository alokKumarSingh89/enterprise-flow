import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { MetricsService } from "../src/observability/metrics.service.js";

describe("MetricsService", () => {
  let metrics: MetricsService;

  beforeEach(() => {
    metrics = new MetricsService();
  });

  afterEach(() => {
    metrics.onModuleDestroy();
  });

  it("exposes Prometheus metrics", async () => {
    const output = await metrics.getMetrics();

    expect(output).toContain("enterprise_flow_http_requests_total");
  });

  it("records HTTP requests", async () => {
    metrics.recordRequest("GET", "organizations/:id", 200, 0.025);

    const output = await metrics.getMetrics();

    expect(output).toContain('method="GET"');

    expect(output).toContain('status_code="200"');

    expect(output).toContain("enterprise_flow_http_requests_total");
  });

  it("records request duration", async () => {
    metrics.recordRequest("POST", "organizations", 201, 0.15);

    const output = await metrics.getMetrics();

    expect(output).toContain(
      "enterprise_flow_http_request_duration_seconds_sum",
    );
  });

  it("exposes process metrics", async () => {
    const output = await metrics.getMetrics();

    expect(output).toContain("enterprise_flow_process_");
  });
});
