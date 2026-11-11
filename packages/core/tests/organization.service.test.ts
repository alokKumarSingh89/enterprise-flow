import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  OrganizationService,
  InMemoryOrganizationRepository,
} from "../src/index.js";

import type { IdGenerator } from "../src/index.js";

describe("OrganizationService", () => {
  let service: OrganizationService;
  let repository: InMemoryOrganizationRepository;

  beforeEach(() => {
    repository = new InMemoryOrganizationRepository();

    const idGenerator: IdGenerator = {
      generate: () => "org-test-001",
    };

    service = new OrganizationService(repository, idGenerator);
  });

  it("creates an organization", async () => {
    const result = await service.create({
      name: "EnterpriseFlow",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected success");
    }

    expect(result.data.id).toBe("org-test-001");
    expect(result.data.status).toBe("ACTIVE");
  });

  it("trims organization names", async () => {
    const result = await service.create({
      name: "  EnterpriseFlow  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("EnterpriseFlow");
    }
  });

  it("rejects empty names", async () => {
    const result = await service.create({
      name: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });

  it("rejects duplicate names", async () => {
    await service.create({
      name: "EnterpriseFlow",
    });

    const result = await service.create({
      name: "enterpriseflow",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("CONFLICT");
    }
  });

  it("finds an existing organization", async () => {
    await service.create({
      name: "EnterpriseFlow",
    });

    const result = await service.findById("org-test-001");

    expect(result.success).toBe(true);
  });

  it("returns NOT_FOUND for unknown IDs", async () => {
    const result = await service.findById("missing");

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("does not save invalid organizations", async () => {
    const saveSpy = vi.spyOn(repository, "save");

    await service.create({
      name: "",
    });

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it("rejects names longer than 100 characters", async () => {
    const result = await service.create({
      name: "A".repeat(101),
    });

    expect(result.success).toBe(false);
  });
});
