import { describe, expect, it } from "vitest";

import { canCreateProject } from "../src/organization.js";

import type { Organization } from "../src/organization.js";

const organization: Organization = {
  id: "org-001",
  name: "EnterpriseFlow",
  status: "ACTIVE",
  createdAt: "2026-11-05T00:00:00.000Z",
};

describe("canCreateProject", () => {
  it("allows active organizations", () => {
    expect(canCreateProject(organization)).toBe(true);
  });

  it("rejects suspended organizations", () => {
    expect(
      canCreateProject({
        ...organization,
        status: "SUSPENDED",
      }),
    ).toBe(false);
  });

  it("rejects deleted organizations", () => {
    expect(
      canCreateProject({
        ...organization,
        status: "DELETED",
      }),
    ).toBe(false);
  });
});
