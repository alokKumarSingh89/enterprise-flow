import { Module } from "@nestjs/common";
import { OrganizationsModule } from "./organizations/organizations.module.js";
import { HealthController } from "./health/health.controller.js";

@Module({
  imports: [OrganizationsModule],
  controllers: [HealthController],
})
export class AppModule {}
