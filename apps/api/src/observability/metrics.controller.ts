import { Controller, Get, Inject, Res } from "@nestjs/common";
import type { Response } from "express";
import { MetricsService } from "./metrics.service.js";
@Controller("internal")
export class MetricsController {
  constructor(
    @Inject(MetricsService)
    private readonly metrics: MetricsService,
  ) {}

  @Get("metrics")
  async getMetrics(@Res() response: Response): Promise<void> {
    response.setHeader("Content-Type", this.metrics.getContentType());
    response.send(await this.metrics.getMetrics());
  }
}
