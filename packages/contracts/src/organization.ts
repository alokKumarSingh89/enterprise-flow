export type OrganizationStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly status: OrganizationStatus;
  readonly createdAt: string;
}

export type CreateOrganizationInput = Pick<Organization, "name">;

export function canCreateProject(organization: Organization): boolean {
  return organization.status === "ACTIVE";
}
