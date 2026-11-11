import { failure, success } from "@enterprise-flow/contracts";

import type {
  ApiResult,
  CreateOrganizationInput,
  Organization,
} from "@enterprise-flow/contracts";

import type { OrganizationRepository } from "./organization.repository.js";

import type { IdGenerator } from "./id-generator.js";

export class OrganizationService {
  constructor(
    private readonly repository: OrganizationRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async create(
    input: CreateOrganizationInput,
  ): Promise<ApiResult<Organization>> {
    const name = input.name.trim();

    if (name.length === 0) {
      return failure("VALIDATION_ERROR", "Organization name is required");
    }

    if (name.length > 100) {
      return failure(
        "VALIDATION_ERROR",
        "Organization name must be 100 characters or less",
      );
    }

    const existing = await this.repository.findByName(name);

    if (existing) {
      return failure("CONFLICT", "Organization already exists");
    }

    const organization: Organization = {
      id: this.idGenerator.generate(),
      name,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    await this.repository.save(organization);

    return success(organization);
  }

  async findById(id: string): Promise<ApiResult<Organization>> {
    const organization = await this.repository.findById(id);

    if (!organization) {
      return failure("NOT_FOUND", "Organization not found");
    }

    return success(organization);
  }
}
