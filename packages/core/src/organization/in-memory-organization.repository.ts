import type { Organization } from "@enterprise-flow/contracts";

import type { OrganizationRepository } from "./organization.repository.js";

export class InMemoryOrganizationRepository implements OrganizationRepository {
  private readonly organizations = new Map<string, Organization>();

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) ?? null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const normalizedName = name.toLowerCase();

    for (const organization of this.organizations.values()) {
      if (organization.name.toLowerCase() === normalizedName) {
        return organization;
      }
    }

    return null;
  }

  async save(organization: Organization): Promise<void> {
    this.organizations.set(organization.id, organization);
  }
}
