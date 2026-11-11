import type { Organization } from "@enterprise-flow/contracts";

export interface Repository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
}

export interface OrganizationRepository extends Repository<
  Organization,
  string
> {
  findByName(name: string): Promise<Organization | null>;
}
