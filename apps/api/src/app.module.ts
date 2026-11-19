import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { OrganizationsModule } from "./organizations/organizations.module.js";
import { HealthController } from "./health/health.controller.js";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RequestLoggingInterceptor } from "./common/interceptors/request-logging.interceptor.js";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware.js";

@Module({
  imports: [OrganizationsModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
