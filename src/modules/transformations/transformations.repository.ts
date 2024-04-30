import {
  EntityManager,
  EntityRepository,
  EntitySchema,
  FindConditions,
  InsertResult,
  ObjectType,
  UpdateResult,
} from 'typeorm';

@EntityRepository()
export class TransformationsRepository {
  constructor(private manager: EntityManager) {}

  /**
   * Create or Update the transco data for a specific entity
   * TODO: Add missing types
   *
   * @param {ObjectType<EntitySchema>} entity - The entity which should be used to insert the data for
   * @param data - The transformation rule object  which will be created or updated
   * @param {string[]} primaryKeys - // TODO: Document the purpose of this
   * @returns {Promise<InsertResult | UpdateResult>}
   */
  public async upsertData<T>(
    entity: ObjectType<EntitySchema>,
    data,
    primaryKeys: string[],
  ): Promise<InsertResult | UpdateResult> {
    const whereClause = primaryKeys.reduce((whereClause, key) => ({...whereClause, [key]: data[key]}), {});
    const result = await this.manager.findOne<T>(entity, whereClause);

    if (!result) {
      return this.manager.insert<T>(entity, data);
    }

    return this.manager.update<T>(entity, whereClause, data);
  }

  /**
   * Find a specific entity by a given conditions
   *
   * @param {ObjectType<EntitySchema>} entity - The entity which should be used by the query
   * @param {FindConditions<T>} conditions - List with conditions which should be used to find the correct result
   * @returns {Promise<T>}
   */
  public async findOne<T>(entity: ObjectType<EntitySchema>, conditions: FindConditions<T>): Promise<T> {
    return this.manager.findOne<T>(entity, conditions);
  }
}
