import { describe, expect, it, vi } from "vitest";

import { TypedEventBus } from "../src/domain-events.js";

describe("TypedEventBus", () => {
  it("delivers the correct payload", () => {
    const bus = new TypedEventBus();
    const handler = vi.fn();

    bus.subscribe("PROJECT_CREATED", handler);

    bus.publish("PROJECT_CREATED", {
      projectId: "p-1",
      organizationId: "org-1",
      createdBy: "user-1",
    });

    expect(handler).toHaveBeenCalledWith({
      projectId: "p-1",
      organizationId: "org-1",
      createdBy: "user-1",
    });
  });

  it("does not notify unrelated subscribers", () => {
    const bus = new TypedEventBus();
    const handler = vi.fn();

    bus.subscribe("PROJECT_DELETED", handler);

    bus.publish("TASK_ASSIGNED", {
      taskId: "task-1",
      assigneeId: "user-2",
      assignedBy: "user-1",
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("supports unsubscribe", () => {
    const bus = new TypedEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe("PROJECT_DELETED", handler);

    unsubscribe();

    bus.publish("PROJECT_DELETED", {
      projectId: "p-1",
      deletedBy: "user-1",
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
