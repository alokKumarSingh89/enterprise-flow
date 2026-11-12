import "reflect-metadata";
import { beforeEach, describe, expect, it } from "vitest";

import { OrganizationsController } from "../src/organizations/organizations.controller.js";
import {
  IdGenerator,
  InMemoryOrganizationRepository,
  OrganizationService,
} from "@enterprise-flow/core";
import { HttpException } from "@nestjs/common";

describe("OrganizationsController", () => {
  let controller: OrganizationsController;

  beforeEach(() => {
    const repository = new InMemoryOrganizationRepository();

    const generator: IdGenerator = {
      generate: () => "org-test-001",
    };

    const service = new OrganizationService(repository, generator);

    controller = new OrganizationsController(service);
  });

  it("creates an organization", async () => {
    const result = await controller.create({
      name: "EnterpriseFlow",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe("org-test-001");
    }
  });

  it("maps duplicate organizations to HTTP 409", async () => {
    await controller.create({
      name: "EnterpriseFlow",
    });

    try {
      await controller.create({
        name: "EnterpriseFlow",
      });

      throw new Error("Expected HttpException");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);

      if (error instanceof HttpException) {
        expect(error.getStatus()).toBe(409);
      }
    }
  });

  it("maps missing organizations to HTTP 404", async () => {
    await expect(controller.findById("missing")).rejects.toMatchObject({
      status: 404,
    });
  });
});
