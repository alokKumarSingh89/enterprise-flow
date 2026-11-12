import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { AppModule } from "./app.module.js";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed",
            details: errors.map((error) => ({
              field: error.property,
              constraints: error.constraints ?? {},
            })),
          },
        });
      },
    }),
  );

  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port, "127.0.0.1");
}

bootstrap().catch((error: unknown) => {
  console.error("Application startup failed", error);
  process.exitCode = 1;
});
