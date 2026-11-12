import { Module } from "@nestjs/common";
import {
  ID_GENERATOR,
  ORGANIZATION_REPOSITORY,
} from "./organization.tokens.js";
import {
  IdGenerator,
  InMemoryOrganizationRepository,
  OrganizationRepository,
  OrganizationService,
  UuidGenerator,
} from "@enterprise-flow/core";
import { OrganizationsController } from "./organizations.controller.js";

@Module({
  controllers: [OrganizationsController],
  providers: [
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: InMemoryOrganizationRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGenerator,
    },
    {
      provide: OrganizationService,
      useFactory: (
        repository: OrganizationRepository,
        idGenerator: IdGenerator,
      ) => {
        return new OrganizationService(repository, idGenerator);
      },
      inject: [ORGANIZATION_REPOSITORY, ID_GENERATOR],
    },
  ],
  exports: [OrganizationService],
})
export class OrganizationsModule {}
