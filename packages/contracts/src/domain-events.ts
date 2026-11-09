export interface DomainEventMap {
  PROJECT_CREATED: {
    projectId: string;
    organizationId: string;
    createdBy: string;
  };
  PROJECT_DELETED: {
    projectId: string;
    deletedBy: string;
  };
  TASK_ASSIGNED: {
    taskId: string;
    assigneeId: string;
    assignedBy: string;
  };
}

export type EventName = keyof DomainEventMap;

export type EventPayload<K extends EventName> = DomainEventMap[K];

export type EventHandler<K extends EventName> = (
  payload: EventPayload<K>,
) => void;

export class TypedEventBus {
  private readonly handlers = new Map<
    EventName,
    Set<(payload: never) => void>
  >();

  subscribe<K extends EventName>(
    event: K,
    handler: EventHandler<K>,
  ): () => void {
    const handlers =
      this.handlers.get(event) ?? new Set<(payload: never) => void>();

    const storeHandler = handler as (payload: never) => void;

    handlers.add(storeHandler);

    this.handlers.set(event, handlers);

    return () => {
      handlers.delete(storeHandler);

      if (handlers.size == 0) {
        this.handlers.delete(event);
      }
    };
  }

  publish<K extends EventName>(event: K, payload: EventPayload<K>): void {
    const handlers = this.handlers.get(event);

    if (!handlers) return;

    for (const handler of [...handlers]) {
      handler(payload as never);
    }
  }
}
