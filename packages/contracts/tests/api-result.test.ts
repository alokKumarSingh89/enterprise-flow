import { describe, expect, it } from "vitest";

import { success, failure, unwrap } from "../src/api-result.js";

describe("ApiResult", () => {
  it("creates a typed success result", () => {
    const result = success({
      id: "project-01",
      name: "EnterpriseFlow",
    });

    expect(result.success).toBe(true);
    expect(result.data.id).toBe("project-01");
  });

  it("creates a failure result", () => {
    const result = failure("NOT_FOUND", "Project not found");

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("NOT_FOUND");
  });

  it("unwraps successful data", () => {
    const result = success(42);

    expect(unwrap(result)).toBe(42);
  });

  it("throws when unwrapping failure", () => {
    const result = failure("FORBIDDEN", "Access denied");

    expect(() => unwrap(result)).toThrow("Access denied");
  });
});
