import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {ClientProfile} from './clientProfile.entity';

@EntityRepository(ClientProfile)
export class ClientProfileRepository extends AbstractRepository<ClientProfile> {
  private q(clientId: string): SelectQueryBuilder<ClientProfile> {
    return this.createQueryBuilder('ClientProfile').where('"ClientProfile"."id" = :clientId', {clientId});
  }

  public async findOneWithLocations(clientId: string): Promise<ClientProfile> {
    return this.q(clientId)
      .select([
        'ClientProfile',
        'Location.id',
        'Location.locationName',
        'Location.isMainLocation',
        'Location.locationName',
        'Location.street',
        'Location.number',
        'Location.city',
        'Location.state',
        'Location.zip',
        'Location.status',
        'Location.country',
      ])
      .leftJoin('ClientProfile.locations', 'Location')
      .orderBy('Location.isMainLocation', 'DESC')
      .getOne();
  }

  public async findOne(id: string): Promise<ClientProfile> {
    return this.manager.findOne(ClientProfile, {where: {id}});
  }

  public async findByExternalCustomerId(externalCustomerId: string): Promise<ClientProfile> {
    return this.manager.findOne(ClientProfile, {where: {externalCustomerId}, relations: ['client']});
  }

  public async save(entity: ClientProfile) {
    return this.manager.save(entity);
  }
}
