import { describe, expect, it } from "vitest";

import { canAccess } from "../src/permissions.js";

describe("Permission Engine", () => {
  it("allows OWNER to delete a project", () => {
    expect(canAccess("OWNER", "project", "delete")).toBe(true);
  });

  it("denies ADMIN deleting a project", () => {
    expect(canAccess("ADMIN", "project", "delete")).toBe(false);
  });

  it("allows VIEWER reading a task", () => {
    expect(canAccess("VIEWER", "task", "read")).toBe(true);
  });

  it("denies VIEWER creating a task", () => {
    expect(canAccess("VIEWER", "task", "create")).toBe(false);
  });

  it("denies ADMIN updating organization", () => {
    expect(canAccess("ADMIN", "organization", "update")).toBe(false);
  });
});
